import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import prisma from "@/lib/prisma";

const jwtSecret = process.env.JWT_SECRET;
if (!jwtSecret && process.env.NODE_ENV === "production") {
  throw new Error("[TAFRAH] CRITICAL: JWT_SECRET must be set in production!");
} else if (!jwtSecret) {
  console.error("[TAFRAH] WARNING: JWT_SECRET not set — using insecure fallback for development only");
}
const SECRET = new TextEncoder().encode(
  jwtSecret || "DEV-ONLY-FALLBACK-DO-NOT-USE-IN-PRODUCTION"
);

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
    .sign(SECRET);
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

/**
 * Get session with DB validation: verifies user exists and isn't banned.
 * Returns fresh role/name from DB to prevent stale JWT data.
 */
export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("tafrah_token")?.value;
  if (!token) return null;

  const decoded = await verifyToken(token);
  if (!decoded) return null;

  // Verify user still exists and isn't banned
  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, role: true, name: true, status: true },
    });

    if (!user || user.status === "banned") {
      return null;
    }

    // Return fresh data from DB (role/name may have changed since JWT was issued)
    return {
      userId: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
    };
  } catch {
    // If DB check fails, fall back to JWT data (fail-open for availability)
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
