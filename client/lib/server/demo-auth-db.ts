import { neon } from '@neondatabase/serverless';
import { createHash, createHmac, pbkdf2Sync, randomBytes, timingSafeEqual } from 'node:crypto';

const DEMO_EMAIL = (process.env.DEMO_LOGIN_EMAIL || 'j.miller@apexbovine.com').trim().toLowerCase();
const ADMIN_EMAIL = (process.env.ADMIN_LOGIN_EMAIL || 'admin@sgip.com').trim().toLowerCase();
const SESSION_TTL_SECONDS = 60 * 60 * 8;

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('DATABASE_URL is not configured');
  return neon(url);
}

function getAuthSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) throw new Error('AUTH_SECRET must be at least 32 characters');
  return secret;
}

export function hashPassword(password: string, salt: string) {
  return pbkdf2Sync(password, salt, 210_000, 32, 'sha256').toString('base64url');
}

export function verifyPassword(password: string, stored: string) {
  const [salt, expected] = stored.split('$');
  if (!salt || !expected) return false;
  const actual = hashPassword(password, salt);
  return timingSafeEqual(Buffer.from(actual), Buffer.from(expected));
}

export function getAccountConfig(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  if (normalizedEmail === DEMO_EMAIL) return { email: DEMO_EMAIL, password: process.env.DEMO_LOGIN_PASSWORD };
  if (normalizedEmail === ADMIN_EMAIL) return { email: ADMIN_EMAIL, password: process.env.ADMIN_LOGIN_PASSWORD };
  return null;
}

export async function ensureSeededAccount(email = DEMO_EMAIL) {
  const account = getAccountConfig(email);
  const seedPassword = account?.password;
  if (!seedPassword) throw new Error(`Password is not configured for ${account?.email || email}`);

  const sql = getSql();
  await sql`CREATE TABLE IF NOT EXISTS demo_access_users (
    email TEXT PRIMARY KEY,
    password_hash TEXT NOT NULL,
    active_session_hash TEXT,
    active_session_expires_at TIMESTAMPTZ,
    device_id_hash TEXT,
    last_user_agent TEXT,
    last_ip TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    last_login_at TIMESTAMPTZ
  )`;
  await sql`ALTER TABLE demo_access_users ADD COLUMN IF NOT EXISTS active_session_expires_at TIMESTAMPTZ`;
  await sql`ALTER TABLE demo_access_users ADD COLUMN IF NOT EXISTS device_id_hash TEXT`;
  await sql`ALTER TABLE demo_access_users ADD COLUMN IF NOT EXISTS last_user_agent TEXT`;
  await sql`ALTER TABLE demo_access_users ADD COLUMN IF NOT EXISTS last_ip TEXT`;

  const salt = process.env.DEMO_PASSWORD_SALT || 'bovine-demo-account-salt-v1';
  const passwordHash = `${salt}$${hashPassword(seedPassword, salt)}`;
  await sql`
    INSERT INTO demo_access_users (email, password_hash)
    VALUES (${account.email}, ${passwordHash})
    ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `;

  const rows = await sql`SELECT email, password_hash, active_session_hash, active_session_expires_at, device_id_hash FROM demo_access_users WHERE email = ${account.email} LIMIT 1`;
  return { sql, user: rows[0] as { email: string; password_hash: string; active_session_hash: string | null; active_session_expires_at: string | null; device_id_hash: string | null } | undefined };
}

export function createSession(email: string) {
  const nonce = randomBytes(32).toString('base64url');
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const encodedEmail = Buffer.from(email, 'utf8').toString('base64url');
  const payload = `${encodedEmail}.${expiresAt}.${nonce}`;
  const signature = createHmac('sha256', getAuthSecret()).update(payload).digest('base64url');
  return { token: `${payload}.${signature}`, nonce, expiresAt };
}

export function readSession(token: string | undefined) {
  if (!token) return null;
  const parts = token.split('.');
  if (parts.length !== 4) return null;
  const [encodedEmail, expiresRaw, nonce, signature] = parts;
  const email = Buffer.from(encodedEmail, 'base64url').toString('utf8');
  const payload = `${encodedEmail}.${expiresRaw}.${nonce}`;
  const expected = createHmac('sha256', getAuthSecret()).update(payload).digest('base64url');
  if (signature.length !== expected.length || !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  if (Number(expiresRaw) < Math.floor(Date.now() / 1000) || !getAccountConfig(email)) return null;
  return { email, nonce };
}

export function hashSessionNonce(nonce: string) {
  return createHash('sha256').update(nonce).digest('base64url');
}

export { DEMO_EMAIL, ADMIN_EMAIL, SESSION_TTL_SECONDS };
