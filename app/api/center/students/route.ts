import { NextResponse } from 'next/server';
import { prisma } from '../../../../lib/prisma';
import { cookies } from 'next/headers';
import * as jose from 'jose';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'fallback-secret');
    const { payload } = await jose.jwtVerify(token, secret);
    
    if (payload.role !== 'center_admin' && payload.role !== 'admin') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const userId = payload.userId as number;
    const user = await prisma.user.findUnique({ where: { id: userId }});
    const centerId = user?.centerId;

    if (!centerId) {
      return NextResponse.json({ error: 'No center associated' }, { status: 400 });
    }

    const students = await prisma.user.findMany({
      where: { centerId, role: 'student' },
      select: {
        id: true,
        name: true,
        email: true,
        category: true,
        chapter: {
          select: { name: true }
        },
        progress: {
          select: {
            quizPassed: true,
            unitIndex: true
          }
        }
      }
    });

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
