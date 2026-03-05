import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// POST /api/auth/recovery — request reset or reset with token
export async function POST(req: NextRequest) {
  try {
    // Rate limit: 5 recovery attempts per hour per IP
    const ip = getClientIp(req);
    const rl = await checkRateLimit(`recovery:${ip}`, { maxRequests: 5, windowSeconds: 3600 });
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many recovery attempts. Please try again later." },
        { status: 429 }
      );
    }

    const body = await req.json();
    const { email, newPassword, token } = body;

    // Step 1: Request reset — generate token (would send via email in production)
    if (email && !token && !newPassword) {
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase().trim() },
        select: { id: true },
      });

      // Always return success to prevent email enumeration
      if (user) {
        // Invalidate any existing tokens for this user
        await prisma.passwordResetToken.updateMany({
          where: { userId: user.id, used: false },
          data: { used: true },
        });

        // Generate secure token with 1-hour expiry
        const resetToken = crypto.randomUUID();
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

        await prisma.passwordResetToken.create({
          data: {
            userId: user.id,
            token: resetToken,
            expiresAt,
          },
        });

        // In production: send email with reset link containing the token
        // For now, log it (remove in production)
        console.log(`[TAFRAH] Password reset token for user #${user.id}: ${resetToken}`);
      }

      return NextResponse.json({
        message: "If an account with that email exists, a recovery link has been sent.",
      });
    }

    // Step 2: Reset password with token verification
    if (token && newPassword) {
      if (typeof token !== "string" || token.length < 10) {
        return NextResponse.json(
          { error: "Invalid or expired reset token" },
          { status: 400 }
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          { error: "Password must be at least 8 characters" },
          { status: 400 }
        );
      }

      // Validate password complexity
      const hasUppercase = /[A-Z]/.test(newPassword);
      const hasLowercase = /[a-z]/.test(newPassword);
      const hasNumber = /[0-9]/.test(newPassword);
      if (!hasUppercase || !hasLowercase || !hasNumber) {
        return NextResponse.json(
          { error: "Password must contain uppercase, lowercase, and a number" },
          { status: 400 }
        );
      }

      // Find and validate the token
      const resetEntry = await prisma.passwordResetToken.findUnique({
        where: { token },
      });

      if (!resetEntry || resetEntry.used || new Date() > resetEntry.expiresAt) {
        return NextResponse.json(
          { error: "Invalid or expired reset token" },
          { status: 400 }
        );
      }

      // Mark token as used
      await prisma.passwordResetToken.update({
        where: { id: resetEntry.id },
        data: { used: true },
      });

      // Update password
      const passwordHash = await bcrypt.hash(newPassword, 12);
      await prisma.user.update({
        where: { id: resetEntry.userId },
        data: { passwordHash },
      });

      await prisma.activityLog.create({
        data: {
          userId: resetEntry.userId,
          action: "password_reset",
          details: "Password was reset via recovery token",
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
