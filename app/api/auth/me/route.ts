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
      // Clear the auth cookie if user is definitively banned or manually deleted in the db
      const response = NextResponse.json({ user: null });
      response.headers.set("Set-Cookie", clearAuthCookie());
      return response;
    }

    return NextResponse.json({ user });
  } catch (error: unknown) {
    // If Prisma connection times out at the node layer, DO NOT nuke the user's UI authentication. 
    // Fall back to the successfully decoded JWT session struct so the site stays usable!
    console.error("[CRITICAL] Session error in /api/auth/me (likely DB Timeout):", error);
    try {
      const fallbackSession = await getSession();
      if (fallbackSession) {
        return NextResponse.json({ 
          user: { 
            id: fallbackSession.userId, 
            email: fallbackSession.email, 
            name: fallbackSession.name, 
            role: fallbackSession.role,
            status: "active"
          } 
        });
      }
    } catch {}
    return NextResponse.json({ user: null });
  }
}
