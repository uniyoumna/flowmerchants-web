"use client";

import { cn } from "@/lib/utils";

type BaseToggleProps = {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  /** Bold line beside the switch. */
  title?: string;
  /** Muted line under the title, explaining what the switch permits. */
  description?: string;
  disabled?: boolean;
  /** Accessible name when there is no visible title. */
  ariaLabel?: string;
  className?: string;
};

/**
 * An on/off switch.
 *
 * Built on a real `button` with `role="switch"` rather than a checkbox so the
 * pressed state is announced as on/off, and the whole row stays clickable when
 * a title and description are supplied.
 */
const BaseToggle = ({
  checked,
  onChange,
  title,
  description,
  disabled,
  ariaLabel,
  className,
}: BaseToggleProps) => {
  const control = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={title ? undefined : ariaLabel}
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]",
        checked ? "bg-[#7C3AED]" : "bg-slate-200",
        disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
      )}
    >
      <span
        className={cn(
          "inline-block size-4.5 rounded-full bg-white shadow-sm transition-transform",
          checked ? "translate-x-6" : "translate-x-1",
        )}
      />
    </button>
  );

  if (!title && !description) {
    return <span className={className}>{control}</span>;
  }

  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="min-w-0">
        {title && (
          <p className="text-sm font-semibold text-slate-900">{title}</p>
        )}
        {description && (
          <p className="mt-0.5 text-sm text-slate-400">{description}</p>
        )}
      </div>

      {control}
    </div>
  );
};

export default BaseToggle;
export { BaseToggle };
export type { BaseToggleProps };
