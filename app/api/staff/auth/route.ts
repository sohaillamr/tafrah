import { NextRequest, NextResponse } from 'next/server';
import { createAdminSession, logAdminAction } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { user, pass } = body;

    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASS = process.env.ADMIN_PASS || 'supreme_vault';

    if (user !== ADMIN_USER || pass !== ADMIN_PASS) {
      await logAdminAction('failed_login', 'Attempted with user: ' + user, req.headers.get('x-forwarded-for') || 'unknown');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await createAdminSession(req.headers.get('x-forwarded-for') || 'unknown');
    await logAdminAction('successful_login', 'Admin Vault Accessed', req.headers.get('x-forwarded-for') || 'unknown');

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
