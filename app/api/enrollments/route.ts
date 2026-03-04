import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// POST /api/enrollments — enroll in a course
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseId } = await req.json();

    const course = await prisma.course.findUnique({ where: { id: courseId } });
    if (!course || !course.available) {
      return NextResponse.json({ error: "Course not available" }, { status: 400 });
    }

    const existing = await prisma.enrollment.findUnique({
      where: { userId_courseId: { userId: session.userId, courseId } },
    });
    if (existing) {
      return NextResponse.json({ error: "Already enrolled" }, { status: 409 });
    }

    const enrollment = await prisma.enrollment.create({
      data: { userId: session.userId, courseId },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "enroll",
        details: `Enrolled in ${course.titleEn}`,
      },
    });

    return NextResponse.json({ enrollment }, { status: 201 });
  } catch (error: unknown) {
    console.error("Enrollment error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/enrollments — get my enrollments
export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: session.userId },
      include: {
        course: { select: { id: true, slug: true, titleAr: true, titleEn: true, category: true, hours: true, modules: true } },
      },
      orderBy: { enrolledAt: "desc" },
    });

    return NextResponse.json({ enrollments });
  } catch (error: unknown) {
    console.error("Enrollments list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
