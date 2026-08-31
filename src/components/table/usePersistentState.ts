"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * `useState` that optionally mirrors its value into `localStorage`.
 *
 * Persistence is opt-in: when `enabled` is false nothing is read or written,
 * so a table can never inherit state left behind by another table — or by an
 * earlier version of its own column set.
 */
export function usePersistentState<T>(
  key: string,
  initialValue: T,
  enabled = true,
): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialValue);

  // Hydrate from localStorage after mount
  useEffect(() => {
    if (!enabled) return;

    try {
      const stored = localStorage.getItem(key);
      if (stored !== null) {
        setState(JSON.parse(stored) as T);
      }
    } catch {
      // ignore
    }
  }, [key, enabled]);

  const setPersistentState = useCallback(
    (value: T | ((prev: T) => T)) => {
      setState((prev) => {
        const next =
          typeof value === "function" ? (value as (prev: T) => T)(prev) : value;

        if (!enabled) return next;

        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // ignore
        }
        return next;
      });
    },
    [key, enabled],
  );

  return [state, setPersistentState];
}
