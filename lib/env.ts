// Environment validation — call at runtime, not build time.
// Vercel does not inject env vars during `next build`.
const requiredVars = ["DATABASE_URL", "JWT_SECRET"];

let _validated = false;

export function validateEnv() {
  if (_validated) return;

  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    const message = `[TAFRAH] Missing environment variables: ${missing.join(", ")}`;
    if (process.env.NODE_ENV === "production") {
      throw new Error(message);
    }
    console.warn(message);
  }

  _validated = true;
}
