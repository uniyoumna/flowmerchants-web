"use client";

import { useCallback, useEffect, useState } from "react";
import { MOCK_MERCHANTS } from "../constants";
import type { Merchant, MerchantsQueryParams } from "../types";

export function useMerchantsList(initialPageSize = 10) {
  const [merchants, setMerchants] = useState<Merchant[]>(MOCK_MERCHANTS);
  const [data, setData] = useState<Merchant[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [status, setStatus] = useState("all");
  const [sortBy, setSortBy] = useState("none");
  const [isLoading, setIsLoading] = useState(false);

  // Debounced search query & page reset
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch((prev) => {
        if (prev !== search) {
          setPage(1);
          return search;
        }
        return prev;
      });
    }, 300);

    return () => clearTimeout(handler);
  }, [search]);

  // Simulated server-side fetch query
  const fetchMerchantsFromServer = useCallback(
    async (params: MerchantsQueryParams) => {
      setIsLoading(true);

      // Simulate backend server latency (e.g. 150ms)
      await new Promise((resolve) => setTimeout(resolve, 150));

      let result = [...merchants];

      // Server-side search filter
      if (params.search && params.search.trim() !== "") {
        const query = params.search.toLowerCase().trim();
        result = result.filter(
          (m) =>
            m.name.toLowerCase().includes(query) ||
            m.arabicName.includes(query) ||
            (m.code?.toLowerCase().includes(query) ?? false) ||
            m.owner.toLowerCase().includes(query) ||
            m.businessType.toLowerCase().includes(query),
        );
      }

      // Server-side status filter
      if (params.status && params.status !== "all") {
        result = result.filter(
          (m) => m.status.toLowerCase() === params.status?.toLowerCase(),
        );
      }

      // Server-side sort
      if (params.sortBy && params.sortBy !== "none") {
        if (params.sortBy === "name") {
          result.sort((a, b) => a.name.localeCompare(b.name));
        } else if (params.sortBy === "joiningDate") {
          result.sort(
            (a, b) =>
              new Date(b.joiningDate).getTime() -
              new Date(a.joiningDate).getTime(),
          );
        } else if (params.sortBy === "status") {
          result.sort((a, b) => a.status.localeCompare(b.status));
        }
      }

      const total = result.length;
      const pages = Math.ceil(total / params.pageSize) || 1;
      const startIndex = (params.page - 1) * params.pageSize;
      const paginatedData = result.slice(
        startIndex,
        startIndex + params.pageSize,
      );

      setData(paginatedData);
      setTotalItems(total);
      setTotalPages(pages);
      setIsLoading(false);
    },
    [merchants],
  );

  useEffect(() => {
    fetchMerchantsFromServer({
      page,
      pageSize,
      search: debouncedSearch,
      status,
      sortBy,
    });
  }, [
    page,
    pageSize,
    debouncedSearch,
    status,
    sortBy,
    fetchMerchantsFromServer,
  ]);

  const handleStatusChange = useCallback((newStatus: string) => {
    setStatus(newStatus);
    setPage(1);
  }, []);

  const handleSortByChange = useCallback((newSortBy: string) => {
    setSortBy(newSortBy);
    setPage(1);
  }, []);

  const deleteMerchant = useCallback((id: string) => {
    setMerchants((prev) => prev.filter((m) => m.id !== id));
  }, []);

  const refetch = useCallback(() => {
    fetchMerchantsFromServer({
      page,
      pageSize,
      search: debouncedSearch,
      status,
      sortBy,
    });
  }, [
    page,
    pageSize,
    debouncedSearch,
    status,
    sortBy,
    fetchMerchantsFromServer,
  ]);

  return {
    data,
    totalItems,
    totalPages,
    page,
    pageSize,
    search,
    status,
    sortBy,
    isLoading,
    setPage,
    setPageSize,
    setSearch,
    setStatus: handleStatusChange,
    setSortBy: handleSortByChange,
    deleteMerchant,
    refetch,
  };
}
