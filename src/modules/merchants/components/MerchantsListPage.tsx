"use client";

import { useMemo, useState } from "react";
import { DeleteConfirmModal } from "@/components/table";
import { createMerchantsColumns } from "../columns/merchantsColumns";
import { useMerchantsList } from "../hooks/useMerchantsList";
import type { Merchant } from "../types";
import MerchantsFilterBar from "./MerchantsFilterBar";
import MerchantsListHeader from "./MerchantsListHeader";
import MerchantsStatsGrid from "./MerchantsStatsGrid";
import MerchantsTableCard from "./MerchantsTableCard";

const MerchantsListPage = () => {
  const {
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
    setSearch,
    setStatus,
    setSortBy,
    deleteMerchant,
  } = useMerchantsList(10);

  const [deletingMerchant, setDeletingMerchant] = useState<Merchant | null>(
    null,
  );

  const handleConfirmDelete = () => {
    if (!deletingMerchant) return;
    deleteMerchant(deletingMerchant.id);
    setDeletingMerchant(null);
  };

  const columns = useMemo(
    () =>
      createMerchantsColumns({
        onView: (merchant) => {
          alert(`Viewing merchant: ${merchant.name}`);
        },
        onEdit: (merchant) => {
          alert(`Editing merchant: ${merchant.name}`);
        },
        onDelete: (merchant) => {
          setDeletingMerchant(merchant);
        },
      }),
    [],
  );

  return (
    <div className="space-y-6">
      {/* ─── 1. Page Header (Title + Add Button) ─── */}
      <MerchantsListHeader />

      {/* ─── 2. Metric KPI Cards ─── */}
      <MerchantsStatsGrid total={totalItems} />

      {/* ─── 3. Server-side Search, Status & Sort Bar ─── */}
      <MerchantsFilterBar
        search={search}
        onSearchChange={setSearch}
        status={status}
        onStatusChange={setStatus}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        isLoading={isLoading}
      />

      {/* ─── 4. Table Card with Custom Header & Design Pagination ─── */}
      <MerchantsTableCard
        data={data}
        columns={columns}
        totalItems={totalItems}
        totalPages={totalPages}
        currentPage={page}
        pageSize={pageSize}
        onPageChange={setPage}
        isLoading={isLoading}
      />

      {/* ─── 5. Delete Confirmation Modal ─── */}
      <DeleteConfirmModal
        isOpen={Boolean(deletingMerchant)}
        title={`Delete "${deletingMerchant?.name}"?`}
        description="This merchant will be removed permanently from your dashboard. Are you sure you want to proceed?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeletingMerchant(null)}
      />
    </div>
  );
};

export default MerchantsListPage;
export { MerchantsListPage };
