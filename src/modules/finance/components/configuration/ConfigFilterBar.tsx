"use client";

import { Loader2, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { BaseSelect } from "@/components/base/BaseSelect";
import {
  CONFIG_DEFAULT_ORDERING,
  CONFIG_QUERY_KEYS,
  CONFIG_SEARCH_DEBOUNCE_MS,
  CONFIG_SORT_OPTIONS,
  CONFIG_STATUS_OPTIONS,
} from "../../constants";
import { ALL_CONFIG_STATUSES } from "../../types";

/** Writes the queue's search, status and ordering straight into the URL. */
const ConfigFilterBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearch = searchParams.get(CONFIG_QUERY_KEYS.search) ?? "";
  const status =
    searchParams.get(CONFIG_QUERY_KEYS.status) ?? ALL_CONFIG_STATUSES;
  const ordering =
    searchParams.get(CONFIG_QUERY_KEYS.ordering) ?? CONFIG_DEFAULT_ORDERING;

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

    params.delete(CONFIG_QUERY_KEYS.page);

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
        [CONFIG_QUERY_KEYS.search]: searchDraft.trim(),
      });
    }, CONFIG_SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchDraft]);

  const isSearching = isPending || searchDraft !== urlSearch;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
      {/* ─── Search (server-side `search` param) ─── */}
      <div className="flex w-full max-w-md items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 transition-all focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/15">
        {isSearching ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-purple-600" />
        ) : (
          <Search className="size-4 shrink-0 text-slate-400" />
        )}

        <input
          type="search"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder="Search workflows..."
          aria-label="Search configuration workflows"
          className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400 [&::-webkit-search-cancel-button]:hidden"
        />

        {searchDraft && (
          <button
            type="button"
            onClick={() => setSearchDraft("")}
            aria-label="Clear search"
            className="shrink-0 cursor-pointer rounded-full p-0.5 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-600"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* ─── Status & Ordering (server-side) ─── */}
      <div className="flex flex-wrap items-center gap-3">
        <BaseSelect
          value={status}
          onValueChange={(value) =>
            applyParams({
              [CONFIG_QUERY_KEYS.status]:
                !value || value === ALL_CONFIG_STATUSES ? "" : value,
            })
          }
          options={CONFIG_STATUS_OPTIONS}
          className="w-44"
        />

        <BaseSelect
          value={ordering}
          onValueChange={(value) =>
            applyParams({
              [CONFIG_QUERY_KEYS.ordering]:
                !value || value === CONFIG_DEFAULT_ORDERING ? "" : value,
            })
          }
          options={CONFIG_SORT_OPTIONS}
          className="w-40"
        />
      </div>
    </div>
  );
};

export default ConfigFilterBar;
export { ConfigFilterBar };
