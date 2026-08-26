"use server";

import type { LoginPayload, LoginResponse } from "@/modules/auth/login/types";
import { customFetch } from "@/utils/customFetch";

// import { redirect } from "next/navigation";

async function loginAction(payload: LoginPayload) {
  const { data, error, status } = await customFetch<LoginResponse>(
    "/auth/login",
    {
      method: "POST",
      body: payload,
      cache: "no-store",
    },
  );

  // Handle API errors
  if (error || !data) {
    if (status === 401) {
      return { success: false, message: "Invalid email or password" } as const;
    }

    if (status === 403) {
      return {
        success: false,
        message: "You don't have access with this role",
      } as const;
    }

    return {
      success: false,
      message: error ?? "Something went wrong. Please try again.",
    } as const;
  }

  // TODO: Store the auth token (cookie/session)
  // cookies().set("auth-token", data.token, { httpOnly: true, secure: true });

  // TODO: Redirect to dashboard
  // redirect("/dashboard");

  return {
    success: true,
    message: "Login successful! Redirecting...",
  } as const;
}

export { loginAction };
