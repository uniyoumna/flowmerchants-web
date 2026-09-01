"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Check } from "lucide-react";
import { useState } from "react";
import { type Resolver, useForm } from "react-hook-form";
import { BaseButton } from "@/components/base/BaseButton";
import { BaseModal } from "@/components/base/BaseModal";
import { FormInput } from "@/components/form/FormInput";
import { FormSelect } from "@/components/form/FormSelect";
import { inviteTeamMemberAction } from "../../actions/teamActions";
import {
  INVITE_EXPIRY_HOURS,
  TEAM_DEPARTMENT_OPTIONS,
  TEAM_ROLE_OPTIONS,
} from "../../constants";
import {
  INVITE_MEMBER_DEFAULTS,
  type InviteMemberValues,
  inviteMemberSchema,
} from "../../schemas/inviteMemberSchema";

type InviteMemberDialogProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * Invites someone to the platform.
 *
 * The dialog has two faces: the form, and the confirmation that follows a
 * successful send. The confirmation is deliberately a separate step rather than
 * a toast — an invite is an email to a real person, and the sender needs to see
 * the address it actually went to before dismissing.
 */
const InviteMemberDialog = ({ isOpen, onClose }: InviteMemberDialogProps) => {
  const [sentTo, setSentTo] = useState<string | null>(null);

  const form = useForm<InviteMemberValues>({
    resolver: zodResolver(inviteMemberSchema) as Resolver<InviteMemberValues>,
    defaultValues: INVITE_MEMBER_DEFAULTS,
  });

  const [serverError, setServerError] = useState<string | null>(null);

  const onSubmit = form.handleSubmit(async (values) => {
    setServerError(null);

    const result = await inviteTeamMemberAction(values);

    if (!result.success) {
      setServerError(result.error ?? "Could not send the invitation.");
      return;
    }

    setSentTo(values.email);
  });

  /** Clears the form so the next open starts blank, not on the last invite. */
  const close = () => {
    setSentTo(null);
    setServerError(null);
    form.reset(INVITE_MEMBER_DEFAULTS);
    onClose();
  };

  // ─── Confirmation ───
  if (sentTo) {
    return (
      <BaseModal
        isOpen={isOpen}
        onClose={close}
        title="Invite Team Member"
        description="They will receive an email to set up their account."
        size="sm"
        footer={
          <BaseButton
            type="button"
            onClick={close}
            className="h-10 rounded-xl bg-[#4C1D95] px-8 font-semibold text-white hover:bg-[#3B1578]"
          >
            Done
          </BaseButton>
        }
        className="sm:max-w-lg"
      >
        <div className="flex flex-col items-center py-8 text-center">
          <span className="flex size-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <Check className="size-8" />
          </span>

          <p className="mt-4 text-lg font-bold text-slate-900">Invite Sent!</p>

          <p className="mt-1 text-sm text-slate-500">
            An invitation email was sent to{" "}
            <span className="font-semibold text-slate-800">{sentTo}</span>.
          </p>
        </div>
      </BaseModal>
    );
  }

  // ─── Form ───
  return (
    <BaseModal
      isOpen={isOpen}
      onClose={close}
      title="Invite Team Member"
      description="They will receive an email to set up their account."
      size="sm"
      footer={
        <>
          <BaseButton
            type="button"
            variant="outline"
            onClick={close}
            disabled={form.formState.isSubmitting}
            className="h-10 rounded-xl border-slate-200 px-6 font-semibold text-slate-700"
          >
            Cancel
          </BaseButton>

          <BaseButton
            type="button"
            onClick={onSubmit}
            isLoading={form.formState.isSubmitting}
            loadingText="Sending..."
            className="h-10 rounded-xl bg-[#4C1D95] px-6 font-semibold text-white hover:bg-[#3B1578]"
          >
            Send Invite
          </BaseButton>
        </>
      }
      className="sm:max-w-lg"
    >
      <div className="space-y-4 pb-2">
        <FormInput
          control={form.control}
          name="fullName"
          label="Full Name"
          placeholder="e.g. Mariam El-Sayed"
        />

        <FormInput
          control={form.control}
          name="email"
          type="email"
          label="Email Address"
          placeholder="name@flow.eg"
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <FormSelect
            control={form.control}
            name="department"
            label="Department"
            options={TEAM_DEPARTMENT_OPTIONS}
          />

          <FormSelect
            control={form.control}
            name="role"
            label="Role"
            options={TEAM_ROLE_OPTIONS}
          />
        </div>

        {/* Says plainly what the invitee receives and how long they have. */}
        <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
          The invitee will receive a secure link to create their password and
          access the platform. Invites expire after{" "}
          <span className="font-semibold text-slate-700">
            {INVITE_EXPIRY_HOURS} hours
          </span>
          .
        </p>

        {serverError && (
          <p className="text-sm font-medium text-rose-600">{serverError}</p>
        )}
      </div>
    </BaseModal>
  );
};

export default InviteMemberDialog;
export { InviteMemberDialog };
export type { InviteMemberDialogProps };
