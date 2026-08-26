"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import type { SidebarState } from "@/modules/dashboard/types";

// ─── Context ─────────────────────────────────────────────────────────────────

type SidebarContextValue = {
  state: SidebarState;
  isCollapsed: boolean;
  toggle: () => void;
  expand: () => void;
  collapse: () => void;
};

const SidebarContext = createContext<SidebarContextValue | null>(null);

// ─── Provider ────────────────────────────────────────────────────────────────

const STORAGE_KEY = "flow-sidebar-state";

function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>("expanded");

  // Hydrate from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as SidebarState | null;
    if (stored === "collapsed" || stored === "expanded") {
      setState(stored);
    }
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => {
      const next = prev === "expanded" ? "collapsed" : "expanded";
      localStorage.setItem(STORAGE_KEY, next);
      return next;
    });
  }, []);

  const expand = useCallback(() => {
    setState("expanded");
    localStorage.setItem(STORAGE_KEY, "expanded");
  }, []);

  const collapse = useCallback(() => {
    setState("collapsed");
    localStorage.setItem(STORAGE_KEY, "collapsed");
  }, []);

  return (
    <SidebarContext
      value={{
        state,
        isCollapsed: state === "collapsed",
        toggle,
        expand,
        collapse,
      }}
    >
      {children}
    </SidebarContext>
  );
}

// ─── Hook ────────────────────────────────────────────────────────────────────

function useSidebar() {
  const context = useContext(SidebarContext);

  if (!context) {
    throw new Error("useSidebar must be used within a SidebarProvider");
  }

  return context;
}

export { SidebarProvider, useSidebar };
