import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitize, clamp } from "@/lib/sanitize";

async function getCenterSession() {
  const session = await getSession();
  if (!session || (session.role !== "center_admin" && session.role !== "admin")) return null;
  const user = await prisma.user.findUnique({ where: { id: session.userId }, select: { centerId: true } });
  if (!user?.centerId) return null;
  return { session, centerId: user.centerId };
}

export async function GET() {
  try {
    const center = await getCenterSession();
    if (!center) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const students = await prisma.user.findMany({
      where: { centerId: center.centerId, role: "student" },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        category: true,
        quizScore: true,
        chapter: { select: { name: true } },
        enrollments: { select: { progress: true, completed: true, course: { select: { titleEn: true, slug: true } } } },
        progress: { select: { quizPassed: true, quizScore: true, unitIndex: true, courseSlug: true } },
      },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(students);
  } catch (error) {
    console.error("Center students GET error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const center = await getCenterSession();
    if (!center) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const body = await request.json();
    const name = sanitize(clamp(body.name || "", 100));
    const email = sanitize(clamp(body.email || "", 120)).toLowerCase();
    const phone = sanitize(clamp(body.phone || "", 30));
    const password = String(body.password || "");
    if (!name || !email || !phone || password.length < 6) {
      return NextResponse.json({ error: "Name, phone, email, and a 6-character password are required" }, { status: 400 });
    }
    const passwordHash = await bcrypt.hash(password, 12);
    const student = await prisma.user.create({
      data: {
        name,
        email,
        phone,
        passwordHash,
        role: "student",
        status: "verified",
        category: "AUTISM",
        centerId: center.centerId,
      },
      select: { id: true, name: true, email: true, phone: true, category: true },
    });
    await prisma.activityLog.create({
      data: {
        userId: center.session.userId,
        action: "center_create_student",
        details: `Created student ${student.id}`,
      },
    });
    return NextResponse.json({ student }, { status: 201 });
  } catch (error: any) {
    if (error.code === "P2002") return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    console.error("Center students POST error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
