/**
 * Extracts human-readable error messages from diverse API response schemas
 * (Django REST Framework, FastAPI, Express, NestJS).
 */
export function extractErrorMessage(
  data: unknown,
  fallbackStatus: number,
): string {
  if (data && typeof data === "object") {
    const record = data as Record<string, unknown>;

    // 1. Direct detail field (DRF standard)
    if (record.detail) {
      if (Array.isArray(record.detail)) {
        return record.detail.map(String).join(" ");
      }
      return String(record.detail);
    }

    // 2. Direct message field
    if (record.message) {
      if (Array.isArray(record.message)) {
        return record.message.map(String).join(" ");
      }
      return String(record.message);
    }

    // 3. Direct error field
    if (record.error) {
      if (Array.isArray(record.error)) {
        return record.error.map(String).join(" ");
      }
      return String(record.error);
    }

    // 4. Field-level validation errors e.g. { "email": ["This field is required."] }
    const firstKey = Object.keys(record)[0];
    if (firstKey && record[firstKey]) {
      const val = record[firstKey];
      if (Array.isArray(val)) {
        return `${firstKey}: ${val.join(", ")}`;
      }
      if (typeof val === "string") {
        return `${firstKey}: ${val}`;
      }
    }
  }

  return `Request failed with status ${fallbackStatus}`;
}
