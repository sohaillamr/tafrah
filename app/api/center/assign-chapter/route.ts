import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session || (session.role !== "center_admin" && session.role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const centerUser = await prisma.user.findUnique({ where: { id: session.userId }, select: { centerId: true } });
    if (!centerUser?.centerId) return NextResponse.json({ error: "No center associated" }, { status: 400 });
    const { studentIds, chapterId } = await request.json();
    if (!Array.isArray(studentIds) || !chapterId) {
      return NextResponse.json({ error: "studentIds and chapterId required" }, { status: 400 });
    }
    const chapter = await prisma.chapter.findFirst({ where: { id: Number(chapterId), centerId: centerUser.centerId } });
    if (!chapter) return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
    await prisma.user.updateMany({
      where: { id: { in: studentIds.map(Number) }, centerId: centerUser.centerId, role: "student" },
      data: { chapterId: chapter.id },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Assign chapter error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
