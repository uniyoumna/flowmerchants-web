/**
 * Display formatters.
 *
 * The locale is pinned to `en-US` rather than left to the runtime: the server
 * and the browser must produce byte-identical output or React reports a
 * hydration mismatch on every formatted number.
 */

const NUMBER_FORMAT = new Intl.NumberFormat("en-US", {
  maximumFractionDigits: 0,
});

/** `284500` → `284,500` */
export function formatAmount(value: number): string {
  return NUMBER_FORMAT.format(value);
}

/** `284500` → `EGP 284,500` */
export function formatCurrency(value: number, currency = "EGP"): string {
  return `${currency} ${formatAmount(value)}`;
}

/**
 * Deductions read as accounting negatives: `12100` → `(12,100)`.
 * The caller passes the magnitude; the parentheses carry the sign.
 */
export function formatDeduction(value: number): string {
  return `(${formatAmount(Math.abs(value))})`;
}

/** Two-letter monogram for an avatar: `"Cairo Electronics Co."` → `"CE"`. */
export function initialsOf(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";

  const letters =
    words.length === 1 ? words[0].slice(0, 2) : `${words[0][0]}${words[1][0]}`;

  return letters.toUpperCase();
}
