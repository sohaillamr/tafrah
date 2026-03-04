/**
 * Strip HTML tags and dangerous characters from user input.
 * Prevents XSS when rendering user-submitted content.
 */
export function sanitize(input: string): string {
  if (!input) return "";
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
}

/**
 * Clamp a string to a max length.
 */
export function clamp(input: string, maxLength: number): string {
  if (!input) return "";
  return input.slice(0, maxLength);
}

/**
 * Sanitize an object's string values (shallow).
 */
export function sanitizeObject<T extends Record<string, unknown>>(
  obj: T,
  maxFieldLength = 5000
): T {
  const result = { ...obj };
  for (const key in result) {
    if (typeof result[key] === "string") {
      (result as Record<string, unknown>)[key] = sanitize(
        clamp(result[key] as string, maxFieldLength)
      );
    }
  }
  return result;
}
