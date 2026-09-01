"use client";

import { X } from "lucide-react";
import type { ReactNode } from "react";
import { BaseButton } from "@/components/base/BaseButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type BaseModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
  /**
   * Replaces the default Cancel / confirm pair entirely. Use it when the modal
   * needs something other than two buttons.
   */
  footer?: ReactNode;
  /** Label of the primary button. Omit it to render no confirm button. */
  confirmLabel?: string;
  onConfirm?: () => void;
  cancelLabel?: string;
  isConfirmLoading?: boolean;
  isConfirmDisabled?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
};

const SIZES: Record<NonNullable<BaseModalProps["size"]>, string> = {
  sm: "sm:max-w-md",
  md: "sm:max-w-2xl",
  lg: "sm:max-w-4xl",
};

/**
 * App-wide modal shell: header, scrollable body and an action row.
 *
 * The body scrolls rather than the page, so a tall form stays inside the
 * viewport with its actions always reachable.
 */
const BaseModal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  confirmLabel,
  onConfirm,
  cancelLabel = "Cancel",
  isConfirmLoading = false,
  isConfirmDisabled = false,
  size = "md",
  className,
}: BaseModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        className={cn(
          "flex max-h-[90vh] flex-col gap-0 rounded-2xl bg-white p-0",
          SIZES[size],
          className,
        )}
        showCloseButton={false}
      >
        {/* ─── Header ─── */}
        <DialogHeader className="flex-row items-start justify-between gap-4 px-6 pt-6 pb-4">
          <div className="space-y-1">
            <DialogTitle className="text-base font-bold text-slate-900">
              {title}
            </DialogTitle>
            {description && (
              <DialogDescription className="text-sm text-slate-500">
                {description}
              </DialogDescription>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="-mt-1 cursor-pointer rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
          >
            <X className="size-4" />
          </button>
        </DialogHeader>

        {/* ─── Body ─── */}
        <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-2">
          {children}
        </div>

        {/* ─── Actions ─── */}
        <div className="flex items-center justify-end gap-3 px-6 pt-4 pb-6">
          {footer ?? (
            <>
              <BaseButton
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isConfirmLoading}
                className="h-10 rounded-xl border-slate-200 px-5 font-semibold text-slate-700"
              >
                {cancelLabel}
              </BaseButton>

              {confirmLabel && (
                <BaseButton
                  type="button"
                  onClick={onConfirm}
                  isLoading={isConfirmLoading}
                  disabled={isConfirmDisabled}
                  className="h-10 rounded-xl bg-linear-to-r from-[#7C3AED] to-[#A855F7] px-5 font-semibold text-white shadow-sm hover:from-[#6D28D9] hover:to-[#9333EA]"
                >
                  {confirmLabel}
                </BaseButton>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BaseModal;
export { BaseModal };
export type { BaseModalProps };
