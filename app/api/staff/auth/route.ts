import { NextRequest, NextResponse } from 'next/server';
import { createHash, timingSafeEqual } from 'node:crypto';
import { createAdminSession, logAdminAction } from '@/lib/admin-auth';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function secureCompare(a: string, b: string) {
  const left = createHash('sha256').update(a).digest();
  const right = createHash('sha256').update(b).digest();
  return timingSafeEqual(left, right);
}

export async function POST(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const rl = await checkRateLimit(`staff-login:${ip}`, { maxRequests: 5, windowSeconds: 300 });
    if (!rl.allowed) {
      await logAdminAction('rate_limited_login', 'Staff vault login rate limit reached', ip);
      return NextResponse.json({ error: 'Too many attempts. Try again later.' }, { status: 429 });
    }

    const body = await req.json();
    const { user, pass } = body;

    const ADMIN_USER = process.env.ADMIN_USER;
    const ADMIN_PASS = process.env.ADMIN_PASS;

    if (!ADMIN_USER || !ADMIN_PASS) {
      await logAdminAction('misconfigured_login', 'Staff vault credentials are missing', ip);
      return NextResponse.json({ error: 'Staff vault is not configured' }, { status: 503 });
    }

    if (!secureCompare(String(user || ''), ADMIN_USER) || !secureCompare(String(pass || ''), ADMIN_PASS)) {
      await logAdminAction('failed_login', 'Invalid staff vault credentials', ip);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await createAdminSession(ip);
    await logAdminAction('successful_login', 'Admin Vault Accessed', ip);

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
