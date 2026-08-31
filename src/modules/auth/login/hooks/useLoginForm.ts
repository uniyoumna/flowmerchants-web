import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useAuth } from "@/modules/auth/context/AuthContext";
import {
  type LoginFormValues,
  loginSchema,
} from "@/modules/auth/login/schemas/loginSchema";

function useLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: LoginFormValues) {
    setServerError(null);

    const result = await login({
      email: data.email,
      password: data.password,
    });

    if (!result.success) {
      const msg = result.message ?? "Authentication failed";
      setServerError(msg);
      toast.error(msg);
      return;
    }

    toast.success("Verification code sent to your email");
    // Redirect user to OTP verification page
    router.push("/otp");
  }

  return {
    register: form.register,
    handleSubmit: form.handleSubmit(onSubmit),
    errors: form.formState.errors,
    isSubmitting: form.formState.isSubmitting,
    serverError,
  };
}

export { useLoginForm };
