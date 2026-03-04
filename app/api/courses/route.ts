import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// GET /api/courses — list courses
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category");
    const difficulty = url.searchParams.get("difficulty");
    const available = url.searchParams.get("available");

    const where: Record<string, unknown> = {};
    if (category) where.category = category;
    if (difficulty) where.difficulty = difficulty;
    if (available !== null) where.available = available === "true";

    const courses = await prisma.course.findMany({
      where,
      include: {
        _count: { select: { enrollments: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    const res = NextResponse.json({ courses });
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return res;
  } catch (error: unknown) {
    console.error("Courses list error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST /api/courses — create course (admin only)
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { slug, titleAr, titleEn, descAr, descEn, category, difficulty, hours, modules, available } = body;

    if (!slug || !titleAr || !titleEn) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const course = await prisma.course.create({
      data: {
        slug,
        titleAr,
        titleEn,
        descAr: descAr || "",
        descEn: descEn || "",
        category: category || "other",
        difficulty: difficulty || "beginner",
        hours: hours || 1,
        modules: modules || 1,
        available: available ?? false,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "admin_create_course",
        details: `Created course: ${titleEn}`,
      },
    });

    return NextResponse.json({ course }, { status: 201 });
  } catch (error: unknown) {
    console.error("Course create error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
