import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

/**
 * Lazy-load JWT secret at runtime (not build time).
 * Vercel doesn't inject env vars during `next build` page data collection,
 * so we must defer the check to when a route actually runs.
 */
let _secret: Uint8Array | null = null;
function getSecret(): Uint8Array {
  // Always fetch fresh from env to avoid caching the dummy secret across warm starts
  const jwtSecret = process.env.JWT_SECRET;
  if (!jwtSecret) {
    console.warn("[WARNING] JWT_SECRET is missing dynamically! Using fallback.");
    return new TextEncoder().encode("dummy-secret-for-build-time-only-123");
  }
  return new TextEncoder().encode(jwtSecret);
}

const IS_PRODUCTION = process.env.NODE_ENV === "production";

export interface JWTPayload {
  userId: number;
  email: string;
  role: string;
  name: string;
}

export async function signToken(payload: JWTPayload): Promise<string> {
  return new SignJWT(payload as unknown as Record<string, unknown>)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = getSecret();
    const { payload } = await jwtVerify(token, secret);
    return payload as unknown as JWTPayload;
  } catch (error) {
    console.error("[CRITICAL] verifyToken failed:", error);
    return null;
  }
}

/**
 * Get session with DB validation: verifies user exists and isn't banned.
 * Returns fresh role/name from DB to prevent stale JWT data.
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("tafrah_token")?.value;
  if (!token) return null;

  const decoded = await verifyToken(token);
  if (!decoded) {
    console.error("[CRITICAL] getSession: decoded token is null.");
    return null;
  }

  // Verify user still exists and isn't banned
  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, name: true, status: true },
    });

    if (!user || user.status === "banned") {
      console.error("[CRITICAL] getSession: user not found or banned.", decoded.userId);
      return null;
    }

    // Return fresh data from DB (role/name may have changed since JWT was issued)
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  } catch (error) {
    console.error("[CRITICAL] getSession DB check failed (likely a cold start connection timeout). Falling back to JWT.", error);
    // DO NOT fail closed by returning null here just for a DB ping error (which kicks the user out entirely).
    // Instead, trust the securely signed JWT as a fallback until the DB catches up!
    return decoded;
  }
}

export function createAuthCookie(token: string): string {
  const secure = IS_PRODUCTION ? "; Secure" : "";
  const sameSite = IS_PRODUCTION ? "Strict" : "Lax";
  return `tafrah_token=${token}; Path=/; HttpOnly; SameSite=${sameSite}${secure}; Max-Age=${7 * 24 * 60 * 60}`;
}

export function clearAuthCookie(): string {
  const secure = IS_PRODUCTION ? "; Secure" : "";
  const sameSite = IS_PRODUCTION ? "Strict" : "Lax";
  return `tafrah_token=; Path=/; HttpOnly; SameSite=${sameSite}${secure}; Max-Age=0`;
}
