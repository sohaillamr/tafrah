import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession, logAdminAction } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { userId, action } = body;

    let user;
    if (action === 'ban') {
      user = await prisma.user.update({ where: { id: userId }, data: { status: 'banned', available: false } });
      await logAdminAction('ban_user', \Banned user \\);
    } else if (action === 'unban') {
      user = await prisma.user.update({ where: { id: userId }, data: { status: 'verified', available: true } });
      await logAdminAction('unban_user', \Unbanned user \\);
    } else if (action === 'make_hr' || action === 'make_admin' || action === 'make_student') {
      const roleMap: any = { make_hr: 'hr', make_admin: 'admin', make_student: 'student' };
      user = await prisma.user.update({ where: { id: userId }, data: { role: roleMap[action] } });
      await logAdminAction('change_role', \Changed user \ role to \\);
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
