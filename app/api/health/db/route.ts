export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
export async function GET() {
  const start = Date.now();
  let prisma;
  try {
    prisma = new PrismaClient();
    await prisma.$connect();
    const count = await prisma.user.count();
    const dbUrl = process.env.DATABASE_URL || 'MISSING';
    return NextResponse.json({ status: 'Pass', count, dbUrl });
  } catch(e) {
    return NextResponse.json({ status: 'Fail', e: e.message });
  }
}