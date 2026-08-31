"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TablePagination } from "@/components/table";
import { MERCHANTS_QUERY_KEYS } from "../../constants";

type MerchantsPaginationProps = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

/**
 * Server-side pagination: the page number lives in the URL (`?page=`) and the
 * Server Component refetches that slice. Nothing is paginated client-side, so
 * only one page of merchants is ever transferred. The pager UI itself is the
 * shared `TablePagination` — this wrapper only owns the URL wiring.
 */
const MerchantsPagination = ({
  totalItems,
  totalPages,
  currentPage,
  pageSize,
}: MerchantsPaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // Page 1 is the default — keep it out of the URL.
    if (page === 1) {
      params.delete(MERCHANTS_QUERY_KEYS.page);
    } else {
      params.set(MERCHANTS_QUERY_KEYS.page, String(page));
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
      itemLabel="merchants"
      ariaLabel="Merchants pagination"
      isPending={isPending}
      className="border-t border-slate-100 px-5 py-3.5"
    />
  );
};

export default MerchantsPagination;
export { MerchantsPagination };
