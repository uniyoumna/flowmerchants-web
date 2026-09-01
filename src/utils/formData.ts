/**
 * Helpers for building multipart request bodies.
 *
 * Every merchant onboarding step posts `FormData`: some steps carry uploads,
 * and one content type keeps the endpoints uniform. These helpers centralise
 * how each kind of value is encoded so the per-step mappers stay declarative.
 */

/**
 * Text is always sent, including when empty.
 *
 * Omitting a blank field would make it impossible to *clear* an optional value
 * on a step the user came back to edit — the stored value would survive the
 * update instead.
 */
export function appendText(formData: FormData, key: string, value = "") {
  formData.append(key, value.trim());
}

/** Repeated keys — the DRF convention for a flat list field in multipart. */
export function appendList(formData: FormData, key: string, values: string[]) {
  for (const value of values) formData.append(key, value);
}

/**
 * A file is only sent when the user picked a new `File`. A `string` means the
 * stored file is unchanged, and re-posting its URL would make the backend treat
 * a URL as an upload (FE-038: replacement creates a new version).
 */
export function appendFile(formData: FormData, key: string, value: unknown) {
  if (value instanceof File) formData.append(key, value);
}

/**
 * Collections of objects (escalation contacts, bank accounts) go up as one
 * JSON part.
 *
 * Multipart has no native encoding for nested structures, and JSON keeps the
 * shape lossless and readable. If the backend settles on indexed keys instead
 * (`contacts[0]name=…`), this function is the only place that changes.
 */
export function appendJson(formData: FormData, key: string, value: unknown) {
  formData.append(key, JSON.stringify(value));
}

/**
 * Reads a collection back from a saved step.
 *
 * Accepts both shapes it can legitimately arrive in: a real array (a JSON API
 * response) or the JSON string that `appendJson` produced. Anything
 * unparseable degrades to an empty list rather than breaking the form.
 */
export function parseJsonList<T>(value: unknown): T[] {
  if (Array.isArray(value)) return value as T[];

  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? (parsed as T[]) : [];
    } catch {
      return [];
    }
  }

  return [];
}
