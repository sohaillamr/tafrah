// Environment validation — call at runtime, not build time.
// Vercel does not inject env vars during `next build`.
const requiredVars = ["DATABASE_URL", "JWT_SECRET"];

let _validated = false;

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

export function validateEnv() {
  if (_validated) return;

  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    const message = `[TAFRAH] Missing environment variables: ${missing.join(", ")}`;
    if (process.env.NODE_ENV === "production" && process.env.NEXT_PHASE !== "phase-production-build") {
      throw new Error(message);
    }
    console.warn(message);
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.DATABASE_URL &&
    !isLikelyPooledDatabaseUrl(process.env.DATABASE_URL)
  ) {
    console.warn(
      "[TAFRAH] Production DATABASE_URL does not look pooled. Use a pooled runtime URL for serverless traffic and keep DIRECT_URL for migrations."
    );
  }

  _validated = true;
}
