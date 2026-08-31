import type { ReactNode } from "react";
import type { UserRole } from "@/modules/auth/constants/users";

// ─── Navigation ──────────────────────────────────────────────────────────────

type NavItem = {
  label: string;
  icon: ReactNode;
  href?: string;
  badge?: number;
  roles?: UserRole[];
  children?: NavChild[];
};

type NavChild = {
  label: string;
  href: string;
  badge?: number;
  roles?: UserRole[];
};

// ─── Sidebar ─────────────────────────────────────────────────────────────────

type SidebarState = "expanded" | "collapsed";

export type { NavItem, NavChild, SidebarState };
