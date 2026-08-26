import type { VariantProps } from "class-variance-authority";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Button, type buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BaseButtonProps = React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    isLoading?: boolean;
    loadingText?: string;
    fullWidth?: boolean;
    children?: ReactNode;
  };

const BaseButton = ({
  isLoading = false,
  loadingText,
  fullWidth = false,
  children,
  className,
  disabled,
  variant,
  size,
  ...props
}: BaseButtonProps) => {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled || isLoading}
      className={cn(fullWidth && "w-full", "cursor-pointer", className)}
      {...props}
    >
      {isLoading ? (
        <>
          <Loader2 className="animate-spin" />
          {loadingText ?? children}
        </>
      ) : (
        children
      )}
    </Button>
  );
};

export default BaseButton;
export { BaseButton };
export type { BaseButtonProps };
