import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

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

export async function getSession(): Promise<JWTPayload | null> {
  const cookieStore = cookies();
  const token = cookieStore.get("tafrah_token")?.value;
  if (!token) return null;
  return verifyToken(token);
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
