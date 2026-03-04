import { NextRequest } from "next/server";

/**
 * Validate that the request originates from the same site.
 * Uses the Origin/Referer headers to prevent CSRF attacks on mutating endpoints.
 * Returns true if the request is safe, false if it should be rejected.
 */
export function validateCsrf(req: NextRequest): boolean {
  // Only check mutating methods
  const method = req.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  const origin = req.headers.get("origin");
  const host = req.headers.get("host");

  if (!origin) {
    // No origin header — allow same-origin fetches (browsers always send origin for cross-origin)
    // Referer check as fallback
    const referer = req.headers.get("referer");
    if (referer) {
      try {
        const refUrl = new URL(referer);
        return refUrl.host === host;
      } catch {
        return false;
      }
    }
    // No origin or referer — could be server-to-server or same-origin; allow
    return true;
  }

  try {
    const originUrl = new URL(origin);
    return originUrl.host === host;
  } catch {
    return false;
  }
}
