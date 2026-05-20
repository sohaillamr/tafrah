export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET /api/health — health check endpoint
export async function GET() {
  const startedAt = Date.now();
  try {
    // Check database connectivity
    await prisma.$queryRaw`SELECT 1`;
    const databaseLatencyMs = Date.now() - startedAt;

    return NextResponse.json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      version: "0.1.0",
      database: {
        status: "connected",
        latencyMs: databaseLatencyMs,
        pooledRuntimeUrl: isLikelyPooledDatabaseUrl(process.env.DATABASE_URL),
        hasDirectUrl: Boolean(process.env.DIRECT_URL),
      },
      services: {
        assistant: Boolean(process.env.GROQ_API_KEY || process.env.GROQ_API_KEY_SECONDARY),
        courseAi: Boolean(process.env.GROQ_COURSE_API_KEY),
        voice: Boolean(process.env.GROQ_API_KEY_VOICE || process.env.GROQ_API_KEY),
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "unhealthy",
        timestamp: new Date().toISOString(),
        database: {
          status: "disconnected",
          latencyMs: Date.now() - startedAt,
        },
        error: error instanceof Error ? error.name : "UnknownError",
      },
      { status: 503 }
    );
  }
}

function isLikelyPooledDatabaseUrl(value?: string) {
  if (!value) return false;
  const lower = value.toLowerCase();
  return (
    lower.includes("pgbouncer=true") ||
    lower.includes("pooler") ||
    lower.includes("supavisor") ||
    lower.includes("accelerate.prisma") ||
    lower.includes("connection_limit=")
  );
}
