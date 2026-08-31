"use client";

import type React from "react";
import { AuthContext } from "@/modules/auth/context/AuthContext";
import { useAuthState } from "@/modules/auth/hooks/useAuthState";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authState = useAuthState();

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
}

export default AuthProvider;
