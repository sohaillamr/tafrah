import { SignJWT, jwtVerify, type JWTPayload } from 'jose';
import { cookies } from 'next/headers';
import prisma from './prisma';

const ADMIN_COOKIE = '__tafrah_admin_vault';
const ADMIN_SECRET = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'fallback_admin_secret_1234');

export async function createAdminSession(ip: string) {
  const token = await new SignJWT({ role: 'supreme_admin', ip })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('12h')
    .sign(ADMIN_SECRET);

  (await cookies()).set(ADMIN_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 12,
  });
}

export async function verifyAdminSession(token: string) {
  try {
    const { payload } = await jwtVerify(token, ADMIN_SECRET);
    return payload.role === 'supreme_admin' ? payload : null;
  } catch {
    return null;
  }
}

export async function getAdminSession() {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!token) return null;
  return verifyAdminSession(token);
}

export async function logAdminAction(action: string, details: string, ip?: string) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        details,
        admin: 'vault_admin',
        ip: ip || 'unknown',
      }
    });
  } catch (error) {
    console.error('AuditLog failed:', error);
  }
}
