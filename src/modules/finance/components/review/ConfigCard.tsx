import type React from "react";
import { cn } from "@/lib/utils";

type ConfigCardProps = {
  title: string;
  /** Rendered at the right of the header, e.g. a section toggle. */
  action?: React.ReactNode;
  /** Icon before the title, used by the collapsible refund section. */
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

/** One titled block of the configuration form. */
const ConfigCard = ({
  title,
  action,
  icon,
  children,
  className,
}: ConfigCardProps) => {
  return (
    <section
      className={cn(
        "overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs",
        className,
      )}
    >
      <div className="flex items-center justify-between gap-4 border-b border-slate-100 px-6 py-5">
        <h3 className="flex items-center gap-2 text-base font-bold text-slate-900">
          {icon}
          {title}
        </h3>

        {action}
      </div>

      <div className="space-y-5 px-6 py-5">{children}</div>
    </section>
  );
};

export default ConfigCard;
export { ConfigCard };
export type { ConfigCardProps };
