import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureSeededAccount, hashSessionNonce, readSession } from '@/lib/server/demo-auth-db';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const session = readSession((await cookies()).get('demo_session')?.value);
    if (session) {
      const { sql } = await ensureSeededAccount(session.email);
      await sql`UPDATE demo_access_users SET active_session_hash = NULL, active_session_expires_at = NULL WHERE email = ${session.email} AND active_session_hash = ${hashSessionNonce(session.nonce)}`;
    }
  } catch {
    // Always clear the browser cookie, even if the database is unavailable.
  }
  const response = NextResponse.json({ ok: true });
  response.cookies.set('demo_session', '', { httpOnly: true, expires: new Date(0), path: '/' });
  response.cookies.set('demo_device_id', '', { httpOnly: true, expires: new Date(0), path: '/' });
  return response;
}
