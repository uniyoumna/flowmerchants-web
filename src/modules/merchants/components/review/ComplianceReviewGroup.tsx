import type React from "react";

type ComplianceReviewGroupProps = {
  title: string;
  children: React.ReactNode;
};

/** A titled block of fields inside a review section, e.g. "Business Identity". */
const ComplianceReviewGroup = ({
  title,
  children,
}: ComplianceReviewGroupProps) => {
  return (
    <section className="space-y-1">
      <h3 className="text-xs font-semibold tracking-wider text-slate-400 uppercase">
        {title}
      </h3>

      <dl>{children}</dl>
    </section>
  );
};

export default ComplianceReviewGroup;
export { ComplianceReviewGroup };
export type { ComplianceReviewGroupProps };
