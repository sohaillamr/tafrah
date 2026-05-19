import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getAdminSession, logAdminAction } from '@/lib/admin-auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getAdminSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { userId, action } = body;
    const normalizedUserId = Number(userId);
    if (!Number.isInteger(normalizedUserId) || normalizedUserId <= 0) {
      return NextResponse.json({ error: 'Invalid user ID' }, { status: 400 });
    }

    let user;
    if (action === 'ban') {
      user = await prisma.user.update({ where: { id: normalizedUserId }, data: { status: 'banned', available: false } });
      await logAdminAction('ban_user', 'Banned user ' + normalizedUserId);
    } else if (action === 'unban') {
      user = await prisma.user.update({ where: { id: normalizedUserId }, data: { status: 'verified', available: true } });
      await logAdminAction('unban_user', 'Unbanned user ' + normalizedUserId);
    } else if (action === 'make_center_admin' || action === 'make_admin' || action === 'make_student') {
      const roleMap: Record<string, string> = { make_center_admin: 'center_admin', make_admin: 'admin', make_student: 'student' };
      user = await prisma.user.update({ where: { id: normalizedUserId }, data: { role: roleMap[action] } });
      await logAdminAction('change_role', 'Changed user ' + normalizedUserId + ' role to ' + roleMap[action]);
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
}
