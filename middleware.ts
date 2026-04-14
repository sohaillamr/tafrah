import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

type MiddlewareJWTPayload = {
  role?: string;
};

let _middlewareSecret: Uint8Array | null = null;
function getMiddlewareSecret(): Uint8Array | null {
  if (_middlewareSecret) return _middlewareSecret;
  const secret = process.env.JWT_SECRET;
  if (!secret) return null;
  _middlewareSecret = new TextEncoder().encode(secret);
  return _middlewareSecret;
}

async function verifyMiddlewareToken(token: string): Promise<MiddlewareJWTPayload | null> {
  const secret = getMiddlewareSecret();
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as MiddlewareJWTPayload;
  } catch {
    return null;
  }
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const langCookie = req.cookies.get("tafrah_lang")?.value || "ar";
  const response = NextResponse.next();
  response.headers.set("x-tafrah-lang", langCookie);

  // --- CSRF Protection on mutating API requests ---
  const method = req.method.toUpperCase();
  if (
    pathname.startsWith("/api/") &&
    method !== "GET" &&
    method !== "HEAD" &&
    method !== "OPTIONS"
  ) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");

    // Prefer Origin validation, fallback to Referer for same-origin requests.
    if (!origin) {
      const referer = req.headers.get("referer");
      if (!referer) {
        return NextResponse.json(
          { error: "CSRF validation failed: missing Origin/Referer" },
          { status: 403 }
        );
      }

      try {
        const refererUrl = new URL(referer);
        if (refererUrl.host !== host) {
          return NextResponse.json(
            { error: "CSRF validation failed" },
            { status: 403 }
          );
        }
      } catch {
        return NextResponse.json(
          { error: "Invalid referer" },
          { status: 403 }
        );
      }
    }

    try {
      if (origin) {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json(
            { error: "CSRF validation failed" },
            { status: 403 }
          );
        }
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid origin" },
        { status: 403 }
      );
    }
  }

  if (pathname.startsWith("/staff/dashboard") || pathname.startsWith("/api/staff/admin")) {
    const adminCookie = req.cookies.get("__tafrah_admin_vault")?.value;
    if (!adminCookie) {
      return NextResponse.redirect(new URL("/staff/login", req.url));
    }
  }

  // --- Server-side route protection for authenticated pages ---
  const protectedRoutes = ["/admin", "/dashboard", "/messages", "/assistant"];
  const isProtectedPage = protectedRoutes.some((r) => pathname.startsWith(r));

  if (isProtectedPage) {
    const token = req.cookies.get("tafrah_token")?.value;
    if (!token) {
      const loginUrl = new URL("/auth/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      
      const redirectResponse = NextResponse.redirect(loginUrl);
      redirectResponse.cookies.set("tafrah_lang", langCookie);
      return redirectResponse;
    }

    // Admin route protection — verify signed JWT and enforce admin role
    if (pathname.startsWith("/admin")) {
      const payload = await verifyMiddlewareToken(token);
      if (!payload || payload.role !== "admin") {
        const unauthorizedUrl = new URL("/dashboard", req.url);
        return NextResponse.redirect(unauthorizedUrl);
      }
    }
  }

  // --- Security headers ---
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()"
  );
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.groq.com https://*.supabase.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  );

  return response;
}

export const config = {
  matcher: [
    "/api/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/messages/:path*",
    "/assistant/:path*",
    "/staff/dashboard/:path*"
  ],
};
