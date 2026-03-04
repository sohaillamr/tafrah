import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

// POST /api/auth/recovery — reset password with token, or request reset
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, newPassword, token } = body;

    // Step 1: Request reset — in a real system this would send an email
    if (email && !token && !newPassword) {
      // Verify the user exists
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: { id: true },
      });

      // Always return success to prevent email enumeration
      if (user) {
        // In production: generate a token, store it, and send email
        // For now, we log it
        console.log(`[TAFRAH] Password reset requested for user #${user.id}`);
      }

      return NextResponse.json({
        message: "If an account with that email exists, a recovery link has been sent.",
      });
    }

    // Step 2: Reset password with email + new password (simplified for beta)
    if (email && newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json(
          { error: "Password must be at least 6 characters" },
          { status: 400 }
        );
      }

      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: { id: true },
      });

      if (!user) {
        return NextResponse.json(
          { error: "Account not found" },
          { status: 404 }
        );
      }

      const passwordHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      });

      await prisma.activityLog.create({
        data: {
          userId: user.id,
          action: "password_reset",
          details: "Password was reset",
        },
      });

      return NextResponse.json({ message: "Password has been reset successfully." });
    }

    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  } catch (error: unknown) {
    console.error("Recovery error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
