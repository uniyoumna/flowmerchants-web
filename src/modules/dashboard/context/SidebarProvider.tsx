"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import { SidebarContext } from "@/modules/dashboard/context/SidebarContext";
import type { SidebarState } from "@/modules/dashboard/types";

const STORAGE_KEY = "flow-sidebar-state";

export function SidebarProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<SidebarState>("expanded");

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as SidebarState | null;
      if (stored === "collapsed" || stored === "expanded") {
        setState(stored);
      }
    } catch {
      // ignore storage errors
    }
  }, []);

  const toggle = useCallback(() => {
    setState((prev) => {
      const next = prev === "expanded" ? "collapsed" : "expanded";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // ignore
      }
      return next;
    });
  }, []);

  const expand = useCallback(() => {
    setState("expanded");
    try {
      localStorage.setItem(STORAGE_KEY, "expanded");
    } catch {
      // ignore
    }
  }, []);

  const collapse = useCallback(() => {
    setState("collapsed");
    try {
      localStorage.setItem(STORAGE_KEY, "collapsed");
    } catch {
      // ignore
    }
  }, []);

  return (
    <SidebarContext.Provider
      value={{
        state,
        isCollapsed: state === "collapsed",
        toggle,
        expand,
        collapse,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
}

export default SidebarProvider;
