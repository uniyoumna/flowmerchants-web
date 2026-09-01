"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TablePagination } from "@/components/table";
import { TRANSACTIONS_QUERY_KEYS } from "../../constants";

type TransactionsPaginationProps = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

/**
 * Server-side pagination: the page number lives in the URL and the Server
 * Component refetches that slice, so only one page of transactions is ever
 * transferred. This wrapper owns the URL wiring; the pager UI is shared.
 */
const TransactionsPagination = ({
  totalItems,
  totalPages,
  currentPage,
  pageSize,
}: TransactionsPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // Page 1 is the default — keep it out of the URL.
    if (page === 1) {
      params.delete(TRANSACTIONS_QUERY_KEYS.page);
    } else {
      params.set(TRANSACTIONS_QUERY_KEYS.page, String(page));
    }

    const queryString = params.toString();

    startTransition(() => {
      router.push(queryString ? `${pathname}?${queryString}` : pathname, {
        scroll: false,
      });
    });
  };

  return (
    <TablePagination
      current_page={currentPage}
      totalPages={totalPages}
      onPageChange={goToPage}
      totalItems={totalItems}
      pageSize={pageSize}
      itemLabel="transactions"
      ariaLabel="Transactions pagination"
      isPending={isPending}
      className="border-t border-slate-100 px-6 py-3.5"
    />
  );
};

export default TransactionsPagination;
export { TransactionsPagination };
