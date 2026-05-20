#!/usr/bin/env node

import fs from "node:fs";

for (const file of [".env", ".env.local"]) {
  if (!fs.existsSync(file)) continue;
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) continue;
    const index = trimmed.indexOf("=");
    const key = trimmed.slice(0, index).trim();
    const raw = trimmed.slice(index + 1).trim();
    if (!process.env[key]) {
      process.env[key] = raw.replace(/^["']|["']$/g, "");
    }
  }
}

const required = ["DATABASE_URL", "JWT_SECRET"];
const recommended = ["DIRECT_URL", "GROQ_API_KEY", "GROQ_COURSE_API_KEY"];

function isLikelyPooled(value = "") {
  const lower = value.toLowerCase();
  return (
    lower.includes("pgbouncer=true") ||
    lower.includes("pooler") ||
    lower.includes("supavisor") ||
    lower.includes("accelerate.prisma") ||
    lower.includes("connection_limit=")
  );
}

const missingRequired = required.filter((key) => !process.env[key]);
const missingRecommended = recommended.filter((key) => !process.env[key]);
const warnings = [];

if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
  warnings.push("JWT_SECRET should be at least 32 characters.");
}

if (process.env.DATABASE_URL && !isLikelyPooled(process.env.DATABASE_URL)) {
  warnings.push("DATABASE_URL does not look pooled. Use the pooled runtime URL in production.");
}

if (process.env.DIRECT_URL && process.env.DIRECT_URL === process.env.DATABASE_URL) {
  warnings.push("DIRECT_URL should normally be the direct DB URL, while DATABASE_URL should be pooled.");
}

const result = {
  ok: missingRequired.length === 0 && warnings.length === 0,
  missingRequired,
  missingRecommended,
  warnings,
  checkedAt: new Date().toISOString(),
};

console.log(JSON.stringify(result, null, 2));

if (missingRequired.length > 0 || warnings.length > 0) {
  process.exitCode = 1;
}
