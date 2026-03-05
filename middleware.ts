import { NextRequest, NextResponse } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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

    // Reject mutating requests without Origin header (blocks curl/server-side CSRF)
    if (!origin) {
      return NextResponse.json(
        { error: "CSRF validation failed: missing Origin header" },
        { status: 403 }
      );
    }

    try {
      const originUrl = new URL(origin);
      if (originUrl.host !== host) {
        return NextResponse.json(
          { error: "CSRF validation failed" },
          { status: 403 }
        );
      }
    } catch {
      return NextResponse.json(
        { error: "Invalid origin" },
        { status: 403 }
      );
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
      return NextResponse.redirect(loginUrl);
    }

    // Admin route protection — quick JWT payload check (base64 decode)
    if (pathname.startsWith("/admin")) {
      try {
        const payloadBase64 = token.split(".")[1];
        const payload = JSON.parse(
          Buffer.from(payloadBase64, "base64").toString()
        );
        if (payload.role !== "admin") {
          return NextResponse.redirect(new URL("/", req.url));
        }
      } catch {
        return NextResponse.redirect(new URL("/auth/login", req.url));
      }
    }
  }

  // --- Security headers ---
  const response = NextResponse.next();
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
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://api.groq.com https://*.supabase.com;"
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
  ],
};
