"use client";

import { Loader2, Trash2, TriangleAlert } from "lucide-react";
import { BaseButton } from "@/components/base/BaseButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type DeleteConfirmModalProps = {
  isOpen: boolean;
  isDeleting?: boolean;
  title?: string;
  description?: string;
  onConfirm: () => void;
  onCancel: () => void;
};

const DeleteConfirmModal = ({
  isOpen,
  isDeleting = false,
  title = "Are you sure you want to delete?",
  description = "This item will be deleted permanently. You will not be able to restore it again.",
  onConfirm,
  onCancel,
}: DeleteConfirmModalProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent
        className="max-w-md rounded-2xl p-6 text-center"
        showCloseButton={false}
      >
        <div className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-xs">
          <TriangleAlert className="size-7" />
        </div>

        <DialogHeader className="mt-4 space-y-2 text-center">
          <DialogTitle className="text-lg font-bold text-slate-900">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm text-slate-500 leading-relaxed">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-6 flex items-center justify-center gap-3">
          <BaseButton
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-10 rounded-xl bg-rose-600 px-5 text-sm font-semibold text-white shadow-sm hover:bg-rose-700 disabled:opacity-50"
          >
            {isDeleting ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Trash2 className="mr-2 size-4" />
            )}
            Delete
          </BaseButton>

          <BaseButton
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            variant="outline"
            className="h-10 rounded-xl border-slate-200 px-5 text-sm font-medium text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </BaseButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteConfirmModal;
export { DeleteConfirmModal };
export type { DeleteConfirmModalProps };
