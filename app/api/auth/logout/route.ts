export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("tafrah_token");
  
  return NextResponse.json({ success: true });
}

export async function GET(req: NextRequest) {
  const cookieStore = await cookies();
  cookieStore.delete("tafrah_token");
  
  const referer = req.headers.get("referer");
  let loginUrl = new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000");
  
  if (referer) {
    try {
      const refUrl = new URL(referer);
      // Only attach redirect if it's from our own app and it's a protected path
      if (refUrl.pathname.startsWith("/assistant") || refUrl.pathname.startsWith("/admin") || refUrl.pathname.startsWith("/dashboard")) {
        loginUrl.searchParams.set("redirect", refUrl.pathname);
      }
    } catch (e) {
      // Ignore malformed referer
    }
  }

  return NextResponse.redirect(loginUrl);
}
