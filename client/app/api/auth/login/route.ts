import { NextResponse } from 'next/server';
import { createSession, ensureSeededAccount, hashSessionNonce, verifyPassword, SESSION_TTL_SECONDS, DEMO_EMAIL } from '@/lib/server/demo-auth-db';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body.password === 'string' ? body.password : '';
    if (email !== DEMO_EMAIL || !password) return NextResponse.json({ error: 'Invalid demo credentials.' }, { status: 401 });

    const { sql, user } = await ensureSeededAccount();
    if (!user || !verifyPassword(password, user.password_hash)) {
      return NextResponse.json({ error: 'Invalid demo credentials.' }, { status: 401 });
    }

    const session = createSession(email);
    const claimed = await sql`
      UPDATE demo_access_users
      SET active_session_hash = ${hashSessionNonce(session.nonce)},
          active_session_expires_at = TO_TIMESTAMP(${session.expiresAt}),
          last_login_at = NOW()
      WHERE email = ${email}
        AND (active_session_hash IS NULL OR active_session_expires_at IS NULL OR active_session_expires_at <= NOW())
      RETURNING email
    `;
    if (claimed.length === 0) {
      return NextResponse.json({ error: 'This demo is already open in another browser. Sign out there before starting a new session.' }, { status: 409 });
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set('demo_session', session.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: SESSION_TTL_SECONDS,
    });
    return response;
  } catch (error) {
    console.error('[demo-auth] sign-in failed', error);
    return NextResponse.json({ error: 'Demo sign-in is temporarily unavailable.' }, { status: 503 });
  }
}
