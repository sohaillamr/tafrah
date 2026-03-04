// Environment validation — imported at app startup
const requiredVars = ["DATABASE_URL", "JWT_SECRET"];

export function validateEnv() {
  const missing = requiredVars.filter((v) => !process.env[v]);
  if (missing.length > 0) {
    console.error(`[TAFRAH] Missing required environment variables: ${missing.join(", ")}`);
    console.error("[TAFRAH] Please set them in .env.local before running the app.");
    console.error("[TAFRAH] DATABASE_URL → Your Supabase PostgreSQL connection string");
    console.error("[TAFRAH] JWT_SECRET   → A secure random string for JWT tokens");
  }
}

validateEnv();
