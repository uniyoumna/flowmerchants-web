import { z } from "zod";

/**
 * Zod helpers for fields backed by `BaseFileUpload`.
 *
 * A file field holds one of three things, and validation has to accept all of
 * them: a `File` just picked in the browser, the URL of a file the backend
 * already stored (edit mode), or `null` when it is empty.
 */

/** A filled file field — a newly picked `File`, or a stored file's URL. */
const filledFile = z.union([z.instanceof(File), z.string().trim().min(1)]);

/**
 * Required upload. `message` is what the user sees when nothing is attached.
 *
 * Size and MIME limits are enforced by `BaseFileUpload` at pick time and again
 * by the backend (FE-268) — this only asserts that something is attached.
 */
export function requiredFileSchema(message: string) {
  return filledFile.nullish().refine((value) => value != null, { message });
}

/** Optional upload — resolves to `null` when left empty. */
export function optionalFileSchema() {
  return filledFile
    .nullish()
    .transform((value) => value ?? null)
    .pipe(z.union([z.instanceof(File), z.string(), z.null()]));
}
