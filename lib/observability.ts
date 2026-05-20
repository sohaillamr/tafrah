type LogLevel = "info" | "warn" | "error";

type LogPayload = Record<string, unknown>;

export function getRequestId(headers?: Headers): string {
  const incoming =
    headers?.get("x-request-id") ||
    headers?.get("x-vercel-id") ||
    headers?.get("cf-ray");
  return incoming || crypto.randomUUID();
}

export function logEvent(level: LogLevel, event: string, payload: LogPayload = {}) {
  const entry = {
    level,
    event,
    timestamp: new Date().toISOString(),
    ...payload,
  };

  const message = JSON.stringify(entry);
  if (level === "error") {
    console.error(message);
  } else if (level === "warn") {
    console.warn(message);
  } else {
    console.info(message);
  }
}

export function errorSummary(error: unknown) {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: process.env.NODE_ENV === "production" ? undefined : error.stack,
    };
  }
  return { message: String(error) };
}
