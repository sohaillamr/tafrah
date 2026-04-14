export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

// GET /api/courses/[id]
export async function GET(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id: rawId } = await params;
    const id = parseInt(rawId);
    const course = await prisma.course.findFirst({
      where: { OR: [{ id: isNaN(id) ? -1 : id }, { slug: rawId }] },
      include: { _count: { select: { enrollments: true } } },
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    const res = NextResponse.json({ course });
    res.headers.set("Cache-Control", "public, s-maxage=60, stale-while-revalidate=120");
    return res;
  } catch (error: unknown) {
    console.error("Course get error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH /api/courses/[id] — admin only
export async function PATCH(
  req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    const body = await req.json();

    const data: Record<string, unknown> = {};
    const allowed = ["titleAr", "titleEn", "descAr", "descEn", "category", "difficulty", "hours", "modules", "available"];
    for (const key of allowed) {
      if (body[key] !== undefined) data[key] = body[key];
    }

    const course = await prisma.course.update({ where: { id }, data });
    return NextResponse.json({ course });
  } catch (error: unknown) {
    console.error("Course update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/courses/[id] — admin only
export async function DELETE(
  _req: NextRequest,
  { params }: RouteContext
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: rawId } = await params;
    const id = parseInt(rawId);
    if (isNaN(id)) {
      return NextResponse.json({ error: "Invalid course ID" }, { status: 400 });
    }
    await prisma.course.delete({ where: { id } });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "admin_delete_course",
        details: `Deleted course #${id}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Course delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
