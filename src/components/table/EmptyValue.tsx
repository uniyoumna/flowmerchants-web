import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type EmptyValueProps = {
  placeholder?: ReactNode;
  className?: string;
};

const EmptyValue = ({ placeholder = "—", className }: EmptyValueProps) => {
  return (
    <span className={cn("text-slate-300 font-mono select-none", className)}>
      {placeholder}
    </span>
  );
};

export default EmptyValue;
export { EmptyValue };
export type { EmptyValueProps };
