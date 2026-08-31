"use client";

import type React from "react";
import { useCallback, useEffect, useRef } from "react";

type OtpPinInputProps = {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  hasError?: boolean;
  onComplete?: (code: string) => void;
};

export const OtpPinInput = ({
  value,
  onChange,
  length = 6,
  disabled = false,
  hasError = false,
  onComplete,
}: OtpPinInputProps) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Split value into array of length
  const digits = Array.from({ length }, (_, i) => value[i] || "");

  // Auto-focus first empty input on mount
  useEffect(() => {
    const firstEmptyIndex = digits.findIndex((d) => !d);
    const targetIndex = firstEmptyIndex === -1 ? 0 : firstEmptyIndex;
    inputRefs.current[targetIndex]?.focus();
  }, [digits]);

  const updateDigits = useCallback(
    (newDigits: string[]) => {
      const code = newDigits.join("");
      onChange(code);

      if (code.length === length && onComplete) {
        onComplete(code);
      }
    },
    [length, onChange, onComplete],
  );

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number,
  ) => {
    const targetValue = e.target.value;
    const sanitized = targetValue.replace(/\D/g, "");

    if (!sanitized) {
      const newDigits = [...digits];
      newDigits[index] = "";
      updateDigits(newDigits);
      return;
    }

    // Handle single character
    const char = sanitized.slice(-1);
    const newDigits = [...digits];
    newDigits[index] = char;
    updateDigits(newDigits);

    // Auto-advance to next input
    if (index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace") {
      if (!digits[index] && index > 0) {
        // Current is already empty, move to previous and clear it
        e.preventDefault();
        const newDigits = [...digits];
        newDigits[index - 1] = "";
        updateDigits(newDigits);
        inputRefs.current[index - 1]?.focus();
      }
    } else if (e.key === "ArrowLeft" && index > 0) {
      e.preventDefault();
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === "ArrowRight" && index < length - 1) {
      e.preventDefault();
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    const cleanNumbers = pastedData.replace(/\D/g, "").slice(0, length);

    if (!cleanNumbers) return;

    const newDigits = Array.from({ length }, (_, i) => cleanNumbers[i] || "");
    updateDigits(newDigits);

    // Focus either the next empty slot or the last slot
    const nextEmptyIndex = newDigits.findIndex((d) => !d);
    const focusIndex = nextEmptyIndex === -1 ? length - 1 : nextEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-3">
      {Array.from({ length }).map((_, index) => {
        const digit = digits[index] || "";
        const isFilled = Boolean(digit);

        return (
          <input
            key={`otp-slot-${index + 1}`}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength={1}
            value={digit}
            disabled={disabled}
            onChange={(e) => handleInputChange(e, index)}
            onKeyDown={(e) => handleKeyDown(e, index)}
            onPaste={handlePaste}
            className={`size-12 sm:size-14 text-center text-xl font-bold rounded-xl border transition-all outline-none ${
              hasError
                ? "border-destructive bg-destructive/5 text-destructive focus:ring-2 focus:ring-destructive/30"
                : isFilled
                  ? "border-purple-600 bg-purple-50/40 text-purple-950 shadow-xs"
                  : "border-slate-200 bg-white text-slate-900 hover:border-slate-300 focus:border-purple-500 focus:ring-4 focus:ring-purple-500/15"
            } disabled:cursor-not-allowed disabled:opacity-50`}
          />
        );
      })}
    </div>
  );
};
