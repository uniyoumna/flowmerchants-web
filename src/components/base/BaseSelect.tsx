"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

type SelectOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type BaseSelectProps = {
  label?: string;
  /** Renders the asterisk and sets `aria-required` on the trigger. */
  required?: boolean;
  error?: string;
  helperText?: string;
  placeholder?: string;
  options: SelectOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string | null) => void;
  disabled?: boolean;
  containerClassName?: string;
  className?: string;
  size?: "sm" | "default";
  id?: string;
  name?: string;
};

const BaseSelect = ({
  label,
  required,
  error,
  helperText,
  placeholder = "Select an option",
  options,
  value,
  defaultValue,
  onValueChange,
  disabled,
  containerClassName,
  className,
  size = "default",
  id,
  name,
}: BaseSelectProps) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <Label
          htmlFor={selectId}
          className="text-sm font-medium text-foreground"
        >
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </Label>
      )}

      {/* `items` lets the trigger render the selected option's *label*.
          Without it Base UI prints the raw value ("current" instead of
          "Current"). */}
      <Select
        items={options}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        disabled={disabled}
        name={name}
      >
        <SelectTrigger
          id={selectId}
          size={size}
          aria-invalid={!!error}
          aria-required={required}
          className={cn(
            "h-10 min-w-36 rounded-lg border border-slate-200 bg-gray-100 px-3.5 text-sm text-slate-700 shadow-2xs focus-visible:border-[#7C3AED] focus-visible:ring-[#7C3AED]/20",
            error && "border-destructive focus-visible:ring-destructive/20",
            className,
          )}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>

        <SelectContent className="rounded-xl border border-slate-100 bg-white p-1 shadow-lg z-50">
          {options.map((opt) => (
            <SelectItem
              key={opt.value}
              value={opt.value}
              disabled={opt.disabled}
              className="cursor-pointer rounded-lg px-3 py-2 text-sm text-slate-700 hover:bg-purple-50 hover:text-[#7C3AED] focus:bg-purple-50 focus:text-[#7C3AED]"
            >
              {opt.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

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

export default BaseSelect;
export { BaseSelect };
export type { BaseSelectProps, SelectOption };
