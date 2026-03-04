import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";

// PATCH /api/users/[id] — update user (admin: status change; self: profile update)
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);
    const body = await req.json();

    // Admin can change status, role
    if (session.role === "admin") {
      const data: Record<string, unknown> = {};
      if (body.status) data.status = body.status;
      if (body.role) data.role = body.role;

      const user = await prisma.user.update({
        where: { id: userId },
        data,
        select: { id: true, name: true, email: true, role: true, status: true },
      });

      await prisma.activityLog.create({
        data: {
          userId: session.userId,
          action: "admin_update_user",
          details: `Updated user #${userId}: ${JSON.stringify(data)}`,
        },
      });

      return NextResponse.json({ user });
    }

    // Self can update profile
    if (session.userId !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const data: Record<string, unknown> = {};
    if (body.name) data.name = body.name;
    if (body.bio !== undefined) data.bio = body.bio;
    if (body.jobTitle !== undefined) data.jobTitle = body.jobTitle;
    if (body.available !== undefined) data.available = body.available;

    const user = await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true, name: true, email: true, role: true, status: true,
        bio: true, jobTitle: true, available: true,
      },
    });

    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error("User update error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// GET /api/users/[id] — get user profile
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const userId = parseInt(params.id);

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        bio: true,
        jobTitle: true,
        available: true,
        companyName: true,
        createdAt: true,
        enrollments: {
          include: { course: { select: { titleAr: true, titleEn: true, slug: true } } },
        },
        _count: { select: { enrollments: true, applications: true } },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error("User get error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE /api/users/[id] — admin only
export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);
    await prisma.user.delete({ where: { id: userId } });

    await prisma.activityLog.create({
      data: {
        userId: session.userId,
        action: "admin_delete_user",
        details: `Deleted user #${userId}`,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("User delete error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
