export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type XpEvent = {
  id: number;
  action: string;
  xp: number;
  courseSlug?: string;
  unitIndex?: number;
  createdAt: Date;
};

function parseXpEvent(log: { id: number; action: string; details: string | null; createdAt: Date }): XpEvent | null {
  if (!log.action.startsWith("xp_")) return null;
  try {
    const details = log.details ? JSON.parse(log.details) : {};
    const xp = Number(details.xp || 0);
    if (!Number.isFinite(xp) || xp <= 0) return null;
    return {
      id: log.id,
      action: log.action,
      xp,
      courseSlug: typeof details.courseSlug === "string" ? details.courseSlug : undefined,
      unitIndex: typeof details.unitIndex === "number" ? details.unitIndex : undefined,
      createdAt: log.createdAt,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  if (session.role === "center_admin") return NextResponse.json({ totalXp: 0, events: [] });

  const logs = await prisma.activityLog.findMany({
    where: { userId: session.userId, action: { startsWith: "xp_" } },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: { id: true, action: true, details: true, createdAt: true },
  });

  const events = logs.map(parseXpEvent).filter(Boolean) as XpEvent[];
  const totalXp = events.reduce((sum, event) => sum + event.xp, 0);

  return NextResponse.json({ totalXp, events });
}
