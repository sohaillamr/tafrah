export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { signToken } from "@/lib/auth";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { cookies } from "next/headers";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 10 login attempts per minute per IP
    const ip = getClientIp(req);
    const rl = await checkRateLimit(`login:${ip}`, { maxRequests: 10, windowSeconds: 60 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many login attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    if (user.status === "banned") {
      return NextResponse.json(
        { error: "Account is banned" },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "login",
        details: `${user.role} logged in`,
      },
    });

    const token = await signToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    });

    const response = NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        status: user.status,
      },
    });

    const isProduction = process.env.NODE_ENV === "production";
    
    // Set cookie using next/headers to ensure max compatibility inside server actions/routes
    const cookieStore = await cookies();
    cookieStore.set("tafrah_token", token, {
      httpOnly: true,
      secure: isProduction,
      sameSite: "lax",
      maxAge: 30 * 24 * 60 * 60, // 30 days
      path: "/",
    });

    return response;
  } catch (error: any) {
    console.error("[CRITICAL] Login Exception Dump:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });
    
    return NextResponse.json(
      { 
        error: "Internal server error", 
        details: process.env.NODE_ENV !== "production" ? error.message : undefined,
        debug_code: error.code || error.name || "Unknown"
      },
      { status: 500 }
    );
  }
}
