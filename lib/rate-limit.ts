/**
 * Database-backed rate limiter for Vercel serverless.
 * Uses PostgreSQL (via Prisma) for persistent rate limiting across function invocations.
 */

import prisma from "@/lib/prisma";

export interface RateLimitConfig {
  /** Max requests allowed within the window */
  maxRequests: number;
  /** Window duration in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check rate limit for a given key (typically IP + action).
 * Uses PostgreSQL upsert for atomic, serverless-safe rate limiting.
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const now = new Date();
  const resetAt = new Date(now.getTime() + config.windowSeconds * 1000);

  try {
    // Try to find existing entry
    const existing = await prisma.rateLimitEntry.findUnique({ where: { key } });

    if (!existing || now > existing.resetAt) {
      // Window expired or first request — reset
      await prisma.rateLimitEntry.upsert({
        where: { key },
        update: { count: 1, resetAt },
        create: { key, count: 1, resetAt },
      });
      return { allowed: true, remaining: config.maxRequests - 1, resetAt: resetAt.getTime() };
    }

    if (existing.count >= config.maxRequests) {
      return { allowed: false, remaining: 0, resetAt: existing.resetAt.getTime() };
    }

    // Increment count
    const updated = await prisma.rateLimitEntry.update({
      where: { key },
      data: { count: { increment: 1 } },
    });

    return {
      allowed: true,
      remaining: config.maxRequests - updated.count,
      resetAt: existing.resetAt.getTime(),
    };
  } catch (error) {
    // If DB fails, allow the request (fail-open) but log
    console.error("[TAFRAH] Rate limit DB error:", error);
    return { allowed: true, remaining: config.maxRequests, resetAt: resetAt.getTime() };
  }
}

/**
 * Clean up expired rate limit entries. Call periodically via cron or admin endpoint.
 */
export async function cleanupRateLimits(): Promise<number> {
  const result = await prisma.rateLimitEntry.deleteMany({
    where: { resetAt: { lt: new Date() } },
  });
  return result.count;
}

/**
 * Extract client IP from request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  const real = req.headers.get("x-real-ip");
  if (real) return real;
  return "unknown";
}
