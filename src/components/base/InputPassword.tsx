"use client";

import { Eye, EyeOff, Lock } from "lucide-react";
import { useState } from "react";
import { BaseInput, type BaseInputProps } from "@/components/base/BaseInput";

type InputPasswordProps = Omit<
  BaseInputProps,
  "type" | "startIcon" | "endIcon"
>;

const InputPassword = ({ ...props }: InputPasswordProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <BaseInput
      type={showPassword ? "text" : "password"}
      startIcon={<Lock />}
      endIcon={
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
          tabIndex={-1}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? <EyeOff /> : <Eye />}
        </button>
      }
      {...props}
    />
  );
};

export default InputPassword;
export { InputPassword };
export type { InputPasswordProps };
