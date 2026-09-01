"use client";

import { ChevronDown } from "lucide-react";
import { useId } from "react";
import type { SelectOption } from "@/components/base/BaseSelect";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type BaseMultiSelectProps = {
  label?: string;
  /** Renders the red asterisk next to the label. */
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: SelectOption[];
  /** Selected option values. Always an array — never `undefined` on the wire. */
  value?: string[];
  onChange?: (value: string[]) => void;
  onBlur?: () => void;
  disabled?: boolean;
  /**
   * Chips beyond this count collapse into a `+N more` chip.
   *
   * Chips are labels only: the trigger is itself a button, so a per-chip remove
   * button would be invalid nested-button markup. Deselecting happens by
   * unchecking the option in the menu.
   */
  maxVisibleChips?: number;
  id?: string;
  name?: string;
  containerClassName?: string;
  className?: string;
};

const BaseMultiSelect = ({
  label,
  required,
  error,
  helperText,
  placeholder = "Select...",
  options,
  value = [],
  onChange,
  onBlur,
  disabled,
  maxVisibleChips = 4,
  id,
  name,
  containerClassName,
  className,
}: BaseMultiSelectProps) => {
  const generatedId = useId();
  const selectId = id ?? name ?? generatedId;

  const selectedOptions = options.filter((option) =>
    value.includes(option.value),
  );
  const visibleChips = selectedOptions.slice(0, maxVisibleChips);
  const hiddenCount = selectedOptions.length - visibleChips.length;

  function toggle(optionValue: string) {
    const next = value.includes(optionValue)
      ? value.filter((item) => item !== optionValue)
      : [...value, optionValue];

    onChange?.(next);
    onBlur?.();
  }

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <Label
          htmlFor={selectId}
          className="text-sm font-medium text-slate-700"
        >
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </Label>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          id={selectId}
          disabled={disabled}
          aria-invalid={!!error}
          className={cn(
            "flex min-h-10 w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-slate-200 bg-gray-100 px-3.5 py-1.5 text-sm text-slate-700 shadow-2xs transition-colors focus-visible:border-[#7C3AED] focus-visible:ring-3 focus-visible:ring-[#7C3AED]/20 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60",
            error && "border-destructive focus-visible:ring-destructive/20",
            className,
          )}
        >
          {selectedOptions.length === 0 ? (
            <span className="text-muted-foreground">{placeholder}</span>
          ) : (
            <span className="flex flex-1 flex-wrap items-center gap-1.5 py-0.5">
              {visibleChips.map((option) => (
                <span
                  key={option.value}
                  className="rounded-md bg-purple-50 px-2 py-0.5 text-xs font-medium text-[#7C3AED]"
                >
                  {option.label}
                </span>
              ))}

              {hiddenCount > 0 && (
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                  +{hiddenCount} more
                </span>
              )}
            </span>
          )}

          <ChevronDown className="size-4 shrink-0 text-slate-400" />
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="start"
          className="max-h-64 w-(--anchor-width) overflow-y-auto rounded-xl border border-slate-100 bg-white p-1 shadow-lg"
        >
          {options.map((option) => (
            <DropdownMenuCheckboxItem
              key={option.value}
              checked={value.includes(option.value)}
              disabled={option.disabled}
              closeOnClick={false}
              onCheckedChange={() => toggle(option.value)}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 focus:bg-purple-50 focus:text-[#7C3AED]"
            >
              {option.label}
            </DropdownMenuCheckboxItem>
          ))}

          {options.length === 0 && (
            <p className="px-3 py-2 text-sm text-slate-400">
              No options available
            </p>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Mirrors the selection for native form submission and E2E selectors. */}
      {name && <input type="hidden" name={name} value={value.join(",")} />}

      {error && (
        <p className="text-xs text-destructive" role="alert">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default BaseMultiSelect;
export { BaseMultiSelect };
export type { BaseMultiSelectProps };
