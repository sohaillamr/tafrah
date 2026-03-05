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
        name: true,
        role: true,
        status: true,
        companyName: true,
        avatarUrl: true,
        bio: true,
        jobTitle: true,
        available: true,
        createdAt: true,
      },
    });

    if (!user || user.status === "banned") {
      // Clear the auth cookie if user doesn't exist or is banned
      const response = NextResponse.json({ user: null });
      response.headers.set("Set-Cookie", clearAuthCookie());
      return response;
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    console.error("Session error:", error);
    return NextResponse.json({ user: null });
  }
}
