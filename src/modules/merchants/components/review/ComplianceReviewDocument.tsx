import { cn } from "@/lib/utils";
import type { ReviewDocument } from "../../types";

type ComplianceReviewDocumentProps = {
  document: ReviewDocument | null;
};

/** Chip colour and caption per file kind — driven by the real extension. */
const KIND_STYLES: Record<ReviewDocument["kind"], string> = {
  pdf: "bg-rose-500",
  image: "bg-[#7C3AED]",
  doc: "bg-blue-500",
};

const KIND_LABELS: Record<ReviewDocument["kind"], string> = {
  pdf: "PDF",
  image: "PNG",
  doc: "DOC",
};

/**
 * An uploaded file as a card rather than a link when there is nothing to open —
 * the reviewer still needs to see that the document was supplied and how big it
 * is, even before file serving exists.
 */
const ComplianceReviewDocument = ({
  document,
}: ComplianceReviewDocumentProps) => {
  if (!document) {
    return <span className="text-sm text-slate-300">Not uploaded</span>;
  }

  const body = (
    <>
      <span
        className={cn(
          "flex size-11 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-white",
          KIND_STYLES[document.kind],
        )}
      >
        {KIND_LABELS[document.kind]}
      </span>

      <span className="min-w-0">
        <span className="block truncate text-sm font-semibold text-slate-900">
          {document.name}
        </span>
        <span className="block text-xs text-slate-400">
          {document.sizeLabel} · uploaded
        </span>
      </span>
    </>
  );

  if (!document.url) {
    return <span className="flex items-center gap-3">{body}</span>;
  }

  return (
    <a
      href={document.url}
      target="_blank"
      rel="noreferrer"
      className="flex items-center gap-3 rounded-lg transition-opacity hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#7C3AED]"
    >
      {body}
    </a>
  );
};

export default ComplianceReviewDocument;
export { ComplianceReviewDocument };
export type { ComplianceReviewDocumentProps };
