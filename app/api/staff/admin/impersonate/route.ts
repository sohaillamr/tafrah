import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession, logAdminAction } from "@/lib/admin-auth";
import { createAuthCookie, signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getAdminSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { userId } = await req.json();
    if (!userId) {
      return NextResponse.json({ error: "Missing user ID" }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (targetUser.status === "banned") {
      await logAdminAction("IMPERSONATION_BLOCKED", `Attempted banned user impersonation ${userId}`);
      return NextResponse.json({ error: "Cannot impersonate a banned user" }, { status: 403 });
    }

    await logAdminAction("IMPERSONATION", `Impersonated user ${userId} (${targetUser.email})`);

    const token = await signToken({
      userId: targetUser.id,
      email: targetUser.email,
      role: targetUser.role,
      name: targetUser.name,
    });

    const response = NextResponse.json({ success: true, redirectUrl: "/dashboard" });
    response.headers.set("Set-Cookie", createAuthCookie(token, 60 * 60));
    return response;
  } catch (error: any) {
    console.error("Impersonation error:", error);
    return NextResponse.json({ error: error.message || "Impersonation failed" }, { status: 500 });
  }
}

