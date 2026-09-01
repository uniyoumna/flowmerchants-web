/**
 * Reads the message off an array-level validation error.
 *
 * A zod issue whose `path` is the array itself (rather than a row) surfaces in
 * react-hook-form either directly on the array error object or nested under
 * `root`, depending on how the array was registered. Checking both keeps
 * collection-wide rules — "mark exactly one primary", "levels must be unique" —
 * visible regardless.
 */
export function fieldArrayErrorMessage(error: unknown): string | undefined {
  if (!error || typeof error !== "object") return undefined;

  const direct = (error as { message?: unknown }).message;
  if (typeof direct === "string") return direct;

  const root = (error as { root?: { message?: unknown } }).root;
  if (root && typeof root.message === "string") return root.message;

  return undefined;
}
