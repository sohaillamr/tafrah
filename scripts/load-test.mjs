#!/usr/bin/env node

const target = process.env.TAFRAH_LOAD_URL || process.argv[2] || "http://localhost:3000";
const durationSeconds = Number(process.env.TAFRAH_LOAD_SECONDS || process.argv[3] || 30);
const concurrency = Number(process.env.TAFRAH_LOAD_CONCURRENCY || process.argv[4] || 20);
const paths = (process.env.TAFRAH_LOAD_PATHS || "/,/courses,/api/health")
  .split(",")
  .map((item) => item.trim())
  .filter(Boolean);

const endAt = Date.now() + durationSeconds * 1000;
const samples = [];
let requests = 0;
let failures = 0;

function percentile(values, pct) {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.min(sorted.length - 1, Math.floor((pct / 100) * sorted.length));
  return Math.round(sorted[index]);
}

async function hit(path) {
  const url = new URL(path, target).toString();
  const startedAt = performance.now();
  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "tafrah-load-test/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    const elapsed = performance.now() - startedAt;
    samples.push(elapsed);
    requests += 1;
    if (!response.ok) failures += 1;
    await response.arrayBuffer();
  } catch {
    failures += 1;
    requests += 1;
    samples.push(performance.now() - startedAt);
  }
}

async function worker(id) {
  let index = id % paths.length;
  while (Date.now() < endAt) {
    await hit(paths[index % paths.length]);
    index += 1;
  }
}

console.log(`Load testing ${target}`);
console.log(`duration=${durationSeconds}s concurrency=${concurrency} paths=${paths.join(",")}`);

await Promise.all(Array.from({ length: concurrency }, (_, index) => worker(index)));

const ok = requests - failures;
const rps = requests / durationSeconds;
const errorRate = requests === 0 ? 0 : (failures / requests) * 100;

console.log(JSON.stringify({
  target,
  durationSeconds,
  concurrency,
  requests,
  ok,
  failures,
  errorRate: `${errorRate.toFixed(2)}%`,
  requestsPerSecond: Number(rps.toFixed(2)),
  latencyMs: {
    p50: percentile(samples, 50),
    p90: percentile(samples, 90),
    p95: percentile(samples, 95),
    p99: percentile(samples, 99),
    max: Math.round(Math.max(...samples, 0)),
  },
}, null, 2));

if (errorRate > 1 || percentile(samples, 95) > 2500) {
  process.exitCode = 1;
}
