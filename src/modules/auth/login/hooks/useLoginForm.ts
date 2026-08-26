import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
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

    const result = login(data.email, data.password);

    if (!result.success) {
      setServerError(result.message ?? "Authentication failed");
      return;
    }

    // Redirect user to their role's specific landing page
    router.push(result.defaultRoute ?? "/merchants");
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
