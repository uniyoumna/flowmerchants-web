"use client";

import { Loader2, Plus, Search, X } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { toast } from "sonner";
import { DataTable } from "@/components/table";
import {
  reactivateTeamMemberAction,
  resendTeamInviteAction,
  suspendTeamMemberAction,
} from "../../actions/teamActions";
import { createTeamColumns } from "../../columns/teamColumns";
import { TEAM_QUERY_KEYS, TEAM_SEARCH_DEBOUNCE_MS } from "../../constants";
import type { TeamListResult, TeamMember } from "../../types";
import { InviteMemberDialog } from "../invite/InviteMemberDialog";
import { TeamPagination } from "./TeamPagination";

type TeamTableCardProps = {
  result: TeamListResult;
  /** True when the sidebar's Invite Member route opened the page. */
  isInviteOpen: boolean;
};

const TeamTableCard = ({ result, isInviteOpen }: TeamTableCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [pendingMemberId, setPendingMemberId] = useState<string | null>(null);

  const urlSearch = searchParams.get(TEAM_QUERY_KEYS.search) ?? "";
  const [searchDraft, setSearchDraft] = useState(urlSearch);

  useEffect(() => {
    if (searchDraft === urlSearch) return;

    const timeoutId = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      const value = searchDraft.trim();

      if (value) {
        params.set(TEAM_QUERY_KEYS.search, value);
      } else {
        params.delete(TEAM_QUERY_KEYS.search);
      }

      // A new search means a new result set, so the old page is meaningless.
      params.delete(TEAM_QUERY_KEYS.page);

      const queryString = params.toString();

      startTransition(() => {
        // `replace` keeps keystrokes out of the history stack.
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        });
      });
    }, TEAM_SEARCH_DEBOUNCE_MS);

    return () => clearTimeout(timeoutId);
  }, [searchDraft, urlSearch, pathname, router, searchParams]);

  /** Suspend, reactivate and resend differ only in which action they call. */
  const runAction = useCallback(
    (
      member: TeamMember,
      action: (
        id: string,
      ) => Promise<{ success: boolean; error: string | null }>,
      successMessage: string,
      failureMessage: string,
    ) => {
      setPendingMemberId(member.id);

      startTransition(async () => {
        const outcome = await action(member.id);
        setPendingMemberId(null);

        if (!outcome.success) {
          toast.error(outcome.error ?? failureMessage);
          return;
        }

        toast.success(successMessage);
        router.refresh();
      });
    },
    [router],
  );

  const columns = useMemo(
    () =>
      createTeamColumns({
        onSuspend: (member) =>
          runAction(
            member,
            suspendTeamMemberAction,
            `${member.name} suspended.`,
            "Could not suspend this member.",
          ),
        onReactivate: (member) =>
          runAction(
            member,
            reactivateTeamMemberAction,
            `${member.name} reactivated.`,
            "Could not reactivate this member.",
          ),
        onResend: (member) =>
          runAction(
            member,
            resendTeamInviteAction,
            `Invitation resent to ${member.email}.`,
            "Could not resend the invitation.",
          ),
        pendingMemberId: isPending ? pendingMemberId : null,
      }),
    [runAction, isPending, pendingMemberId],
  );

  const openInvite = () => router.push("/team/invite", { scroll: false });

  // Closing returns to the plain members route, so the dialog state and the
  // URL never disagree — a refresh or a back press behaves the same way.
  const closeInvite = () => router.push("/team", { scroll: false });

  const isSearching = isPending || searchDraft !== urlSearch;

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
      {/* ─── Toolbar ─── */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
        <div className="flex w-full max-w-sm items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2.5 transition-all focus-within:border-[#7C3AED] focus-within:ring-2 focus-within:ring-[#7C3AED]/15">
          {isSearching ? (
            <Loader2 className="size-4 shrink-0 animate-spin text-purple-600" />
          ) : (
            <Search className="size-4 shrink-0 text-slate-400" />
          )}

          <input
            type="search"
            value={searchDraft}
            onChange={(event) => setSearchDraft(event.target.value)}
            placeholder="Search by name, email, or role..."
            aria-label="Search team members"
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

        <button
          type="button"
          onClick={openInvite}
          className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-[#4C1D95] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#3B1578]"
        >
          <Plus className="size-4" />
          Invite Member
        </button>
      </div>

      {/* ─── Body ─── */}
      {result.error ? (
        <div className="border-t border-slate-100 px-6 py-14 text-center">
          <p className="text-sm font-semibold text-rose-600">
            Could not load the team
          </p>
          <p className="mt-1 text-sm text-slate-500">{result.error}</p>
          <button
            type="button"
            onClick={() => router.refresh()}
            className="mt-4 inline-flex h-9 cursor-pointer items-center rounded-lg border border-slate-200 bg-white px-4 text-xs font-semibold text-slate-700 hover:bg-slate-50"
          >
            Try again
          </button>
        </div>
      ) : (
        <DataTable
          data={result.data}
          columns={columns}
          enableSelection={false}
          showSequence={false}
          isDropDownFilter={false}
          emptyMessage={
            urlSearch ? "No members match this search." : "No team members yet."
          }
        />
      )}

      {/* ─── Server-side Pagination ─── */}
      {!result.error && result.totalPages > 1 && (
        <TeamPagination
          totalItems={result.totalItems}
          totalPages={result.totalPages}
          currentPage={result.page}
          pageSize={result.pageSize}
        />
      )}

      {/* ─── Invite dialog, opened by the button or the sidebar link ─── */}
      <InviteMemberDialog isOpen={isInviteOpen} onClose={closeInvite} />
    </div>
  );
};

export default TeamTableCard;
export { TeamTableCard };
export type { TeamTableCardProps };
