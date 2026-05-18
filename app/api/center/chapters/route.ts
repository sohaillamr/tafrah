import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitize, clamp } from "@/lib/sanitize";

async function getCenterId() {
  const session = await getSession();
  if (!session || (session.role !== "center_admin" && session.role !== "admin")) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { centerId: true } });
  return user?.centerId || null;
}

export async function GET() {
  try {
    const centerId = await getCenterId();
    if (!centerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const chapters = await prisma.chapter.findMany({ where: { centerId }, orderBy: { createdAt: "desc" } });
    return NextResponse.json(chapters);
  } catch (error) {
    console.error("Center chapters GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const centerId = await getCenterId();
    if (!centerId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const name = sanitize(clamp(body.name || "", 80));
    if (!name) return NextResponse.json({ error: "Chapter name required" }, { status: 400 });
    const chapter = await prisma.chapter.create({ data: { name, centerId } });
    return NextResponse.json(chapter, { status: 201 });
  } catch (error) {
    console.error("Center chapters POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
