"use client";

import { Loader2, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { BaseSelect } from "@/components/base/BaseSelect";
import {
  DEFAULT_ORDERING,
  MERCHANT_SORT_OPTIONS,
  MERCHANT_STATUS_OPTIONS,
  MERCHANTS_QUERY_KEYS,
  SEARCH_DEBOUNCE_MS,
} from "../../constants";
import { ALL_STATUSES } from "../../types";

const MerchantsFilterBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearch = searchParams.get(MERCHANTS_QUERY_KEYS.search) ?? "";
  const status = searchParams.get(MERCHANTS_QUERY_KEYS.status) ?? ALL_STATUSES;
  const ordering =
    searchParams.get(MERCHANTS_QUERY_KEYS.ordering) ?? DEFAULT_ORDERING;

  const [searchDraft, setSearchDraft] = useState(urlSearch);
  const lastPushedSearch = useRef(urlSearch);

  useEffect(() => {
    if (urlSearch !== lastPushedSearch.current) {
      lastPushedSearch.current = urlSearch;
      setSearchDraft(urlSearch);
    }
  }, [urlSearch]);

  const applyParams = (updates: Record<string, string>) => {
    const params = new URLSearchParams(searchParams.toString());

    for (const [key, value] of Object.entries(updates)) {
      if (!value) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    }

    params.delete(MERCHANTS_QUERY_KEYS.page);

    const queryString = params.toString();

    startTransition(() => {
      // `replace` keeps filter tweaks out of the history stack.
      router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  const applyParamsRef = useRef(applyParams);
  applyParamsRef.current = applyParams;

  useEffect(() => {
    if (searchDraft === lastPushedSearch.current) return;

    const timeoutId = setTimeout(() => {
      lastPushedSearch.current = searchDraft;
      applyParamsRef.current({
        [MERCHANTS_QUERY_KEYS.search]: searchDraft.trim(),
      });
    }, SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchDraft]);

  const isSearching = isPending || searchDraft !== urlSearch;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
      {/* ─── Search Input (server-side `search` param) ─── */}
      <div className="flex w-full max-w-sm items-center gap-2.5 rounded-lg bg-gray-100 border border-slate-200/80 px-3.5 py-2 transition-all focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/15">
        {isSearching ? (
          <Loader2 className="size-4 animate-spin text-purple-600 shrink-0" />
        ) : (
          <Search className="size-4 text-slate-400 shrink-0" />
        )}

        <input
          type="search"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder="Search merchant by name, code..."
          aria-label="Search merchants"
          className="w-full bg-transparent text-sm text-slate-800 placeholder:text-slate-400 outline-none [&::-webkit-search-cancel-button]:hidden"
        />

        {searchDraft && (
          <button
            type="button"
            onClick={() => setSearchDraft("")}
            aria-label="Clear search"
            className="shrink-0 rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600 cursor-pointer"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* ─── Status & Ordering Selects (server-side `status` / `ordering`) ─── */}
      <div className="flex flex-wrap items-center gap-3">
        <BaseSelect
          value={status}
          onValueChange={(value) =>
            applyParams({
              [MERCHANTS_QUERY_KEYS.status]:
                !value || value === ALL_STATUSES ? "" : value,
            })
          }
          options={MERCHANT_STATUS_OPTIONS}
          className="w-56"
        />

        <BaseSelect
          value={ordering}
          onValueChange={(value) =>
            applyParams({
              [MERCHANTS_QUERY_KEYS.ordering]:
                !value || value === DEFAULT_ORDERING ? "" : value,
            })
          }
          options={MERCHANT_SORT_OPTIONS}
          className="w-44"
        />
      </div>
    </div>
  );
};

export default MerchantsFilterBar;
export { MerchantsFilterBar };
