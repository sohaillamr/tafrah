export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { sanitize, clamp } from "@/lib/sanitize";

const VALID_ROLES = ["student", "hr", "admin"];
const VALID_STATUSES = ["pending", "verified", "banned"];

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
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const body = await req.json();

    // Admin can change status, role
    if (session.role === "admin") {
      const data: Record<string, unknown> = {};
      if (body.status) {
        if (!VALID_STATUSES.includes(body.status)) {
          return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }
        data.status = body.status;
      }
      if (body.role) {
        if (!VALID_ROLES.includes(body.role)) {
          return NextResponse.json({ error: "Invalid role value" }, { status: 400 });
        }
        data.role = body.role;
      }

      if (Object.keys(data).length === 0) {
        return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
      }

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
    if (body.name) data.name = sanitize(clamp(body.name, 100));
    if (body.bio !== undefined) data.bio = sanitize(clamp(body.bio || "", 2000));
    if (body.jobTitle !== undefined) data.jobTitle = sanitize(clamp(body.jobTitle || "", 200));
    if (body.available !== undefined) data.available = Boolean(body.available);

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

// GET /api/users/[id] — get user profile (requires auth, strips sensitive data for non-self/non-admin)
export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = parseInt(params.id);
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    const isSelfOrAdmin = session.userId === userId || session.role === "admin";

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: isSelfOrAdmin, // Only show email to self/admin
        role: true,
        status: isSelfOrAdmin, // Only show status to self/admin
        bio: true,
        jobTitle: true,
        available: true,
        companyName: true,
        createdAt: true,
        enrollments: isSelfOrAdmin ? {
          include: { course: { select: { titleAr: true, titleEn: true, slug: true } } },
        } : false,
        _count: { select: { enrollments: true, applications: isSelfOrAdmin } },
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
    if (isNaN(userId)) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

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
