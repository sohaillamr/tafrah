export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { getSession, clearAuthCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ user: null });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        email: true,
        phone: true,
        name: true,
        role: true,
        status: true,
        category: true,
        uiPreferences: true,
        avatarUrl: true,
        bio: true,
        jobTitle: true,
        available: true,
        createdAt: true,
        centerId: true,
      },
    });

    if (!user || user.status === "banned") {
      // Clear the auth cookie if user is definitively banned or manually deleted in the db
      const response = NextResponse.json({ user: null });
      response.headers.set("Set-Cookie", clearAuthCookie());
      return response;
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error("[CRITICAL] Session error in /api/auth/me:", error);
    return NextResponse.json({ user: null });
  }
}
