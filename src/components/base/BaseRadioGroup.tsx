"use client";

import { cn } from "@/lib/utils";

type RadioOption = {
  label: string;
  value: string;
};

type BaseRadioGroupProps = {
  /** Label displayed above the options. */
  label?: string;
  name: string;
  options: RadioOption[];
  value?: string;
  onChange?: (value: string) => void;
  /** Marks the group as required: renders the asterisk. */
  required?: boolean;
  /** Error message — shows red text below the options. */
  error?: string;
  disabled?: boolean;
  /** Stack the options instead of laying them out in a row. */
  orientation?: "horizontal" | "vertical";
  className?: string;
};

/**
 * A row of radio options.
 *
 * Uses the native input rather than a styled div so keyboard arrow navigation,
 * form association and screen-reader grouping come for free; the visual dot is
 * drawn with `accent-color` over the real control.
 */
const BaseRadioGroup = ({
  label,
  name,
  options,
  value,
  onChange,
  required,
  error,
  disabled,
  orientation = "horizontal",
  className,
}: BaseRadioGroupProps) => {
  return (
    <fieldset className={cn("flex flex-col gap-2", className)}>
      {label && (
        <legend className="mb-0.5 text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </legend>
      )}

      <div
        className={cn(
          "flex gap-x-8 gap-y-2",
          orientation === "horizontal" ? "flex-wrap" : "flex-col",
        )}
      >
        {options.map((option) => (
          <label
            key={option.value}
            className={cn(
              "flex items-center gap-2 text-sm text-slate-700",
              disabled ? "cursor-not-allowed opacity-60" : "cursor-pointer",
            )}
          >
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              disabled={disabled}
              onChange={() => onChange?.(option.value)}
              className="size-4 accent-[#7C3AED]"
            />
            {option.label}
          </label>
        ))}
      </div>

      {error && <p className="text-xs text-rose-500">{error}</p>}
    </fieldset>
  );
};

export default BaseRadioGroup;
export { BaseRadioGroup };
export type { BaseRadioGroupProps, RadioOption };
