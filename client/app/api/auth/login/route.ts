import { NextResponse } from 'next/server';
import { createSession, ensureSeededAccount, getAccountConfig, hashSessionNonce, verifyPassword, SESSION_TTL_SECONDS } from '@/lib/server/demo-auth-db';
import { cookies } from 'next/headers';
import { createHash, randomBytes } from 'node:crypto';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    const account = getAccountConfig(email);
    if (!account || !password) return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });

    const { sql, user } = await ensureSeededAccount(email);
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid credentials.' }, { status: 401 });
    }

    const requestCookies = await cookies();
    const existingDeviceId = requestCookies.get('demo_device_id')?.value;
    const deviceId = existingDeviceId || randomBytes(32).toString('base64url');
    const deviceHash = createHash('sha256').update(deviceId).digest('base64url');
    if (user.device_id_hash && user.device_id_hash !== deviceHash) {
      return NextResponse.json({ error: 'Unable to sign in with these credentials.' }, { status: 401 });
    }

    const session = createSession(email);
    const claimed = await sql`
      UPDATE demo_access_users
      SET active_session_hash = ${hashSessionNonce(session.nonce)},
          active_session_expires_at = TO_TIMESTAMP(${session.expiresAt}),
          last_login_at = NOW()
      WHERE email = ${email}
        AND (active_session_hash IS NULL OR active_session_expires_at IS NULL OR active_session_expires_at <= NOW())
        AND (device_id_hash IS NULL OR device_id_hash = ${deviceHash})
      
      RETURNING email
    `;
    if (claimed.length === 0) {
      return NextResponse.json({ error: 'Unable to sign in with these credentials.' }, { status: 401 });
    }
    const forwardedFor = request.headers.get('x-forwarded-for');
    const ip = forwardedFor?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || null;
    await sql`UPDATE demo_access_users SET device_id_hash = ${deviceHash}, last_user_agent = ${request.headers.get('user-agent') || null}, last_ip = ${ip} WHERE email = ${email}`;
    const response = NextResponse.json({ ok: true });
    response.cookies.set('demo_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });
    response.cookies.set('demo_device_id', deviceId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 90,
    });
    return response;
  } catch (error) {
    console.error('[demo-auth] sign-in failed', error);
    return NextResponse.json({ error: 'Demo sign-in is temporarily unavailable.' }, { status: 503 });
  }
}
