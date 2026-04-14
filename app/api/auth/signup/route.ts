export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { signToken, createAuthCookie } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";
import { sanitize, clamp } from "@/lib/sanitize";

export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 signups per hour per IP
    const ip = getClientIp(req);
    const rl = await checkRateLimit(`signup:${ip}`, { maxRequests: 5, windowSeconds: 3600 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many signup attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, password, name, role, companyName, commercialReg, quizScore } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Better email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNum = /[0-9]/.test(password);
    if (!hasUpper || !hasLower || !hasNum) {
      return NextResponse.json(
        { error: "Password must contain uppercase, lowercase, and a number" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const safeName = sanitize(clamp(name, 100));
    const safeCompany = companyName ? sanitize(clamp(companyName, 200)) : null;

    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase().trim(),
        passwordHash,
        name: safeName,
        role: ["student", "hr"].includes(role) ? role : "student",
        status: "pending",
        companyName: safeCompany,
        commercialReg: commercialReg || null,
        quizScore: typeof quizScore === "number" ? quizScore : null,
      },
    });

    await prisma.activityLog.create({
      data: {
        userId: user.id,
        action: "signup",
        details: `New ${user.role} account created`,
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

    response.headers.set("Set-Cookie", createAuthCookie(token));
    return response;
  } catch (error: any) {
    console.error("[CRITICAL] Signup Exception Dump:", {
      message: error.message,
      stack: error.stack,
      code: error.code,
      name: error.name
    });

    // Special check for Prisma Unique Constraint (P2002 means duplicate email usually)
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "Email already exists" },
        { status: 400 }
      );
    }
    
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
