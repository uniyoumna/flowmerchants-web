import type { ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type BaseInputProps = React.ComponentProps<"input"> & {
  /** Label displayed above the input */
  label?: string;
  /** Error message — shows red text below the input */
  error?: string;
  /** Helper text — shows muted text below the input */
  helperText?: string;
  /** Icon or element rendered at the start (left) of the input */
  startIcon?: ReactNode;
  /** Icon or element rendered at the end (right) of the input */
  endIcon?: ReactNode;
  /** Additional className for the outer container */
  containerClassName?: string;
};

const BaseInput = ({
  label,
  error,
  helperText,
  startIcon,
  endIcon,
  containerClassName,
  className,
  id,
  ...props
}: BaseInputProps) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <Label
          htmlFor={inputId}
          className="text-sm font-medium text-foreground"
        >
          {label}
        </Label>
      )}

      <div className="relative flex items-center">
        {startIcon && (
          <span className="pointer-events-none absolute left-3 flex items-center text-muted-foreground [&_svg]:size-4">
            {startIcon}
          </span>
        )}

        <Input
          id={inputId}
          aria-invalid={!!error}
          className={cn(
            "h-11 rounded-lg text-sm",
            startIcon && "pl-10",
            endIcon && "pr-10",
            error && "border-destructive focus-visible:ring-destructive/20",
            className,
          )}
          {...props}
        />

        {endIcon && (
          <span className="absolute right-3 flex items-center text-muted-foreground [&_svg]:size-4">
            {endIcon}
          </span>
        )}
      </div>

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

export default BaseInput;
export { BaseInput };
export type { BaseInputProps };
