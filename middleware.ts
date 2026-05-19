import { jwtVerify } from "jose/jwt/verify";
import { NextRequest, NextResponse } from "next/server";

type TafrahJwtPayload = {
  role?: string;
};

function encodedSecret(value?: string) {
  return value ? new TextEncoder().encode(value) : null;
}

async function verifyUserToken(token: string): Promise<TafrahJwtPayload | null> {
  const secret = encodedSecret(process.env.JWT_SECRET);
  if (!secret) return null;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload as TafrahJwtPayload;
  } catch {
    return null;
  }
}

async function verifyStaffToken(token: string): Promise<boolean> {
  const secret = encodedSecret(process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET);
  if (!secret) return false;
  try {
    const { payload } = await jwtVerify(token, secret);
    return payload.role === "supreme_admin";
  } catch {
    return false;
  }
}

function redirectToLogin(req: NextRequest, pathname: string, langCookie: string) {
  const loginUrl = new URL("/auth/login", req.url);
  loginUrl.searchParams.set("redirect", pathname);
  const redirectResponse = NextResponse.redirect(loginUrl);
  redirectResponse.cookies.delete("tafrah_token");
  redirectResponse.cookies.set("tafrah_lang", langCookie);
  return redirectResponse;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const langCookie = req.cookies.get("tafrah_lang")?.value || "ar";
  const response = NextResponse.next();
  response.headers.set("x-tafrah-lang", langCookie);

  const method = req.method.toUpperCase();
  if (
    pathname.startsWith("/api/") &&
    method !== "GET" &&
    method !== "HEAD" &&
    method !== "OPTIONS"
  ) {
    const origin = req.headers.get("origin");
    const host = req.headers.get("host");

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
          return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
        }
      } catch {
        return NextResponse.json({ error: "Invalid referer" }, { status: 403 });
      }
    }

    try {
      if (origin) {
        const originUrl = new URL(origin);
        if (originUrl.host !== host) {
          return NextResponse.json({ error: "CSRF validation failed" }, { status: 403 });
        }
      }
    } catch {
      return NextResponse.json({ error: "Invalid origin" }, { status: 403 });
    }
  }

  if (pathname.startsWith("/staff/dashboard") || pathname.startsWith("/api/staff/admin")) {
    const adminCookie = req.cookies.get("__tafrah_admin_vault")?.value;
    if (!adminCookie || !(await verifyStaffToken(adminCookie))) {
      return NextResponse.redirect(new URL("/staff/login", req.url));
    }
  }

  const protectedRoutes = ["/admin", "/dashboard", "/messages", "/assistant"];
  const isProtectedPage = protectedRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedPage) {
    const token = req.cookies.get("tafrah_token")?.value;
    if (!token) return redirectToLogin(req, pathname, langCookie);

    const payload = await verifyUserToken(token);
    if (!payload) return redirectToLogin(req, pathname, langCookie);

    if (pathname.startsWith("/dashboard") && payload.role === "student" && !req.cookies.get("tafrah_onboarded")) {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (pathname.startsWith("/admin") && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
  }

  if (
    pathname.startsWith("/auth/login") ||
    pathname.startsWith("/auth/user-signup") ||
    pathname.startsWith("/auth/center-signup") ||
    pathname.startsWith("/auth/select")
  ) {
    const token = req.cookies.get("tafrah_token")?.value;
    const payload = token ? await verifyUserToken(token) : null;
    if (payload) {
      const dest =
        payload.role === "admin" ? "/admin" : payload.role === "center_admin" ? "/dashboard/center" : "/dashboard";
      return NextResponse.redirect(new URL(dest, req.url));
    }
  }

  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Strict-Transport-Security", "max-age=63072000; includeSubDomains; preload");
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("Permissions-Policy", "camera=(), microphone=(self), geolocation=()");
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.groq.com https://*.supabase.com; object-src 'none'; base-uri 'self'; frame-ancestors 'none';"
  );

  return response;
}

export const config = {
  matcher: [
    "/auth/:path*",
    "/api/:path*",
    "/admin/:path*",
    "/dashboard/:path*",
    "/messages/:path*",
    "/assistant/:path*",
    "/staff/dashboard/:path*",
  ],
};
