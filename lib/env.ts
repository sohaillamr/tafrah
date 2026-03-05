// Environment validation — call at runtime, not build time.
// Vercel does not inject env vars during `next build`.
const requiredVars = ["DATABASE_URL", "JWT_SECRET"];

export function validateEnv() {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.warn(`[TAFRAH] Missing environment variables: ${missing.join(", ")}`);
  }
}
