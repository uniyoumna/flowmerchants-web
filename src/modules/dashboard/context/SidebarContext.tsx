"use client";

import { createContext, useContext } from "react";
import type { SidebarState } from "@/modules/dashboard/types";

export type SidebarContextValue = {
  state: SidebarState;
  isCollapsed: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
};

export const SidebarContext = createContext<SidebarContextValue | null>(null);

export function useSidebar(): SidebarContextValue {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}
