"use client";

import { createContext, useContext } from "react";
import type { AuthContextType } from "@/modules/auth/context/types";

export const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Re-export provider and types for 100% backward compatibility
export { AuthProvider } from "@/modules/auth/context/AuthProvider";
export type { AuthContextType } from "@/modules/auth/context/types";
