"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { TablePagination } from "@/components/table";
import { COMPLIANCE_QUERY_KEYS } from "../../constants";

type CompliancePaginationProps = {
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};

/**
 * Server-side pagination: the page number lives in the URL and the Server
 * Component refetches that slice. This wrapper owns only the URL wiring.
 */
const CompliancePagination = ({
  totalItems,
  totalPages,
  currentPage,
  pageSize,
}: CompliancePaginationProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const goToPage = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // Page 1 is the default — keep it out of the URL.
    if (page === 1) {
      params.delete(COMPLIANCE_QUERY_KEYS.page);
    } else {
      params.set(COMPLIANCE_QUERY_KEYS.page, String(page));
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
      itemLabel="submissions"
      ariaLabel="Compliance queue pagination"
      isPending={isPending}
      className="border-t border-slate-100 px-5 py-3.5"
    />
  );
};

export default CompliancePagination;
export { CompliancePagination };
