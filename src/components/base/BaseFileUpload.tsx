"use client";

import { FileText, Trash2, UploadCloud } from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

/**
 * What a file field can hold:
 * - `File`   — freshly picked in the browser, still to be uploaded
 * - `string` — URL of a file already stored by the backend (edit mode)
 * - `null`   — empty
 */
type FileValue = File | string | null;

type BaseFileUploadProps = {
  label?: string;
  /** Renders the red asterisk next to the label. */
  required?: boolean;
  error?: string;
  helperText?: string;
  value?: FileValue;
  onChange?: (value: FileValue) => void;
  onBlur?: () => void;
  /** `accept` attribute, e.g. `"image/png,image/jpeg"`. */
  accept?: string;
  /** Rejected above this size, in megabytes. */
  maxSizeMb?: number;
  /** Second line inside the dropzone — defaults to a line built from the rules. */
  hint?: string;
  disabled?: boolean;
  /** Dropzone height. Documents sit in a shorter box than the logo. */
  height?: "sm" | "md";
  id?: string;
  name?: string;
  containerClassName?: string;
};

const HEIGHTS: Record<NonNullable<BaseFileUploadProps["height"]>, string> = {
  sm: "h-40",
  md: "h-56",
};

/** `1536000` → `1.5 MB` */
function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function isImageFile(value: FileValue): boolean {
  if (value instanceof File) return value.type.startsWith("image/");
  if (typeof value === "string") {
    return /\.(png|jpe?g|gif|webp|svg)$/i.test(value);
  }
  return false;
}

/** Last path segment of a stored file URL, used as its display name. */
function fileNameOf(value: FileValue): string {
  if (value instanceof File) return value.name;
  if (typeof value === "string") {
    return decodeURIComponent(value.split("/").pop() ?? "Uploaded file");
  }
  return "";
}

/** `"image/png,image/jpeg"` → `"PNG, JPEG"` */
function describeAccept(accept?: string): string {
  if (!accept) return "Any file type";

  return accept
    .split(",")
    .map((type) => type.trim().split("/").pop()?.replace(".", "").toUpperCase())
    .filter(Boolean)
    .join(", ");
}

const BaseFileUpload = ({
  label,
  required,
  error,
  helperText,
  value = null,
  onChange,
  onBlur,
  accept,
  maxSizeMb,
  hint,
  disabled,
  height = "md",
  id,
  name,
  containerClassName,
}: BaseFileUploadProps) => {
  const generatedId = useId();
  const inputId = id ?? name ?? generatedId;
  const inputRef = useRef<HTMLInputElement>(null);

  const [isDragging, setIsDragging] = useState(false);
  /** Client-side rejection (wrong type / too large) — distinct from the form error. */
  const [localError, setLocalError] = useState<string | null>(null);

  // Object URLs leak unless revoked, so the preview URL is owned here.
  const previewUrl = useMemo(() => {
    if (!isImageFile(value)) return null;
    if (typeof value === "string") return value;
    return URL.createObjectURL(value as File);
  }, [value]);

  useEffect(() => {
    if (!previewUrl?.startsWith("blob:")) return;
    return () => URL.revokeObjectURL(previewUrl);
  }, [previewUrl]);

  const acceptedTypes = useMemo(
    () =>
      accept
        ?.split(",")
        .map((type) => type.trim().toLowerCase())
        .filter(Boolean) ?? [],
    [accept],
  );

  function isAcceptedType(file: File): boolean {
    if (acceptedTypes.length === 0) return true;

    return acceptedTypes.some((type) => {
      if (type.startsWith(".")) return file.name.toLowerCase().endsWith(type);
      if (type.endsWith("/*")) return file.type.startsWith(type.slice(0, -1));
      return file.type.toLowerCase() === type;
    });
  }

  function selectFile(file: File | undefined) {
    if (!file) return;

    if (!isAcceptedType(file)) {
      setLocalError(
        `Unsupported file type. Allowed: ${describeAccept(accept)}.`,
      );
      return;
    }

    if (maxSizeMb && file.size > maxSizeMb * 1024 * 1024) {
      setLocalError(`File is too large. Maximum size is ${maxSizeMb}MB.`);
      return;
    }

    setLocalError(null);
    onChange?.(file);
    onBlur?.();
  }

  function clearFile() {
    setLocalError(null);
    onChange?.(null);
    // Reset the native input so re-picking the same file still fires `change`.
    if (inputRef.current) inputRef.current.value = "";
  }

  const shownError = error ?? localError;
  const defaultHint = [
    describeAccept(accept),
    maxSizeMb && `(MAX. ${maxSizeMb}MB)`,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={cn("flex flex-col gap-1.5", containerClassName)}>
      {label && (
        <Label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-0.5 text-rose-500">*</span>}
        </Label>
      )}

      {/* ─── Dropzone ─── */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: drag-and-drop is a
          pointer-only enhancement; the file input and the button inside carry
          the keyboard and screen-reader semantics. */}
      <div
        onDragOver={(event) => {
          event.preventDefault();
          if (!disabled) setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          if (!disabled) selectFile(event.dataTransfer.files?.[0]);
        }}
        className={cn(
          "relative flex w-full items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-white transition-colors",
          HEIGHTS[height],
          isDragging && "border-[#7C3AED] bg-purple-50/50",
          shownError && "border-rose-300",
          disabled && "opacity-60",
        )}
      >
        <input
          ref={inputRef}
          id={inputId}
          name={name}
          type="file"
          accept={accept}
          disabled={disabled}
          className="sr-only"
          onChange={(event) => selectFile(event.target.files?.[0])}
        />

        {value ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-3 p-4">
            {previewUrl ? (
              // biome-ignore lint/performance/noImgElement: blob: previews cannot go through next/image.
              <img
                src={previewUrl}
                alt={fileNameOf(value)}
                className="max-h-[55%] max-w-[70%] rounded-lg object-contain"
              />
            ) : (
              <FileText className="size-10 text-[#7C3AED]" />
            )}

            <div className="flex max-w-full items-center gap-2 px-4 text-xs text-slate-500">
              <span className="truncate">{fileNameOf(value)}</span>
              {value instanceof File && (
                <span>· {formatBytes(value.size)}</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={disabled}
                onClick={() => inputRef.current?.click()}
                className="cursor-pointer rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 transition-colors hover:bg-slate-50"
              >
                Replace
              </button>

              <button
                type="button"
                disabled={disabled}
                onClick={clearFile}
                className="flex cursor-pointer items-center gap-1 rounded-lg border border-rose-100 px-3 py-1.5 text-xs font-medium text-rose-600 transition-colors hover:bg-rose-50"
              >
                <Trash2 className="size-3.5" />
                Remove
              </button>
            </div>
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled}
            onClick={() => inputRef.current?.click()}
            className="flex h-full w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-xl px-4 text-center"
          >
            <UploadCloud className="size-8 text-slate-400" />
            <span className="text-sm font-medium text-slate-600">
              Click to upload
            </span>
            <span className="text-xs text-slate-400">
              {hint ?? defaultHint}
            </span>
          </button>
        )}
      </div>

      {shownError && (
        <p className="text-xs text-destructive" role="alert">
          {shownError}
        </p>
      )}

      {helperText && !shownError && (
        <p className="text-xs text-muted-foreground">{helperText}</p>
      )}
    </div>
  );
};

export default BaseFileUpload;
export { BaseFileUpload };
export type { BaseFileUploadProps, FileValue };
