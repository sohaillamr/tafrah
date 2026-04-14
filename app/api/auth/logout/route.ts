export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { clearAuthCookie } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });
  response.headers.set("Set-Cookie", clearAuthCookie());
  return response;
}

export async function GET() {
  const response = NextResponse.redirect(new URL("/auth/login", process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"));
  response.headers.set("Set-Cookie", clearAuthCookie());
  return response;
}
