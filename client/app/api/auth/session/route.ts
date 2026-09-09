import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { ensureSeededAccount, hashSessionNonce, readSession } from '@/lib/server/demo-auth-db';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const session = readSession((await cookies()).get('demo_session')?.value);
    if (!session) return NextResponse.json({ authenticated: false }, { status: 401 });
    const { user } = await ensureSeededAccount(session.email);
    const valid = user?.active_session_hash === hashSessionNonce(session.nonce);
    return NextResponse.json({ authenticated: valid }, { status: valid ? 200 : 401 });
  } catch {
    return NextResponse.json({ authenticated: false }, { status: 401 });
  }
}
