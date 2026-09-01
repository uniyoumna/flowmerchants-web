"use client";

import { Loader2, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import {
  TRANSACTION_STATUS_TAB_LABELS,
  TRANSACTIONS_QUERY_KEYS,
  TRANSACTIONS_SEARCH_DEBOUNCE_MS,
} from "../../constants";
import {
  TRANSACTION_STATUS_TABS,
  type TransactionScope,
  type TransactionStatusTab,
} from "../../types";
import { buildTransactionsStatusHref } from "../../utils/transactionsQuery";

type TransactionsFilterBarProps = {
  scope: TransactionScope;
  activeStatus: TransactionStatusTab;
};

/**
 * Search box plus the status pills.
 *
 * Both write to the URL and the server refetches, so nothing is filtered in the
 * browser. The pills are links rather than buttons, which keeps a filtered view
 * shareable and lets browser back step between filters.
 */
const TransactionsFilterBar = ({
  scope,
  activeStatus,
}: TransactionsFilterBarProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const urlSearch = searchParams.get(TRANSACTIONS_QUERY_KEYS.search) ?? "";
  const [searchDraft, setSearchDraft] = useState(urlSearch);
  const lastPushedSearch = useRef(urlSearch);

  useEffect(() => {
    if (urlSearch !== lastPushedSearch.current) {
      lastPushedSearch.current = urlSearch;
      setSearchDraft(urlSearch);
    }
  }, [urlSearch]);

  useEffect(() => {
    if (searchDraft === lastPushedSearch.current) return;

    const timeoutId = setTimeout(() => {
      lastPushedSearch.current = searchDraft;

      const params = new URLSearchParams(searchParams.toString());
      const value = searchDraft.trim();

      if (value) {
        params.set(TRANSACTIONS_QUERY_KEYS.search, value);
      } else {
        params.delete(TRANSACTIONS_QUERY_KEYS.search);
      }

      // A new search means a new result set, so drop the old page number.
      params.delete(TRANSACTIONS_QUERY_KEYS.page);

      const queryString = params.toString();

      startTransition(() => {
        // replace keeps keystrokes out of the history stack.
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });
      });
    }, TRANSACTIONS_SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchDraft, pathname, router, searchParams]);

  const isSearching = isPending || searchDraft !== urlSearch;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
      {/* ─── Search (server-side search param) ─── */}
      <div className="flex w-full max-w-sm items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-2.5 transition-all focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/15">
        {isSearching ? (
          <Loader2 className="size-4 shrink-0 animate-spin text-purple-600" />
        ) : (
          <Search className="size-4 shrink-0 text-slate-400" />
        )}

        <input
          type="search"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          placeholder="Search by merchant, ID, or customer"
          aria-label="Search transactions"
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

      {/* ─── Status pills (server-side status param) ─── */}
      <nav aria-label="Filter by status" className="flex flex-wrap gap-1">
        {TRANSACTION_STATUS_TABS.map((tab) => {
          const isActive = tab === activeStatus;

          return (
            <Link
              key={tab}
              href={buildTransactionsStatusHref(scope, tab, searchParams)}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "rounded-lg px-4 py-2 text-sm font-medium whitespace-nowrap transition-colors",
                isActive
                  ? "bg-slate-100 text-slate-900"
                  : "text-slate-500 hover:bg-slate-50 hover:text-slate-800",
              )}
            >
              {TRANSACTION_STATUS_TAB_LABELS[tab]}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default TransactionsFilterBar;
export { TransactionsFilterBar };
export type { TransactionsFilterBarProps };
