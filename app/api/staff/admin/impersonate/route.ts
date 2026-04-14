import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getAdminSession, logAdminAction } from "@/lib/admin-auth";
import { SignJWT } from "jose";
import { createAuthCookie } from "@/lib/auth";

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

    await logAdminAction("IMPERSONATION", `Impersonated user ${userId} (${targetUser.email})`);

    // Create standard user token to let them login as the user
    const token = await new SignJWT({ userId: targetUser.id, role: targetUser.role })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("1h")
      .sign(new TextEncoder().encode(process.env.JWT_SECRET!));

    const response = NextResponse.json({ success: true, redirectUrl: "/dashboard/student" });
    response.headers.set("Set-Cookie", createAuthCookie(token));
    return response;
  } catch (error: any) {
    console.error("Impersonation error:", error);
    return NextResponse.json({ error: error.message || "Impersonation failed" }, { status: 500 });
  }
}

