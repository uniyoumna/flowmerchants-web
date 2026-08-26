"use client";

import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/modules/dashboard/constants";
import { useSidebar } from "@/modules/dashboard/hooks/useSidebar";
import { SidebarFooter } from "./SidebarFooter";
import { SidebarHeader } from "./SidebarHeader";
import { SidebarNav } from "./SidebarNav";

const Sidebar = () => {
  const { isCollapsed } = useSidebar();

  return (
    <aside
      className={cn(
        "flex h-screen flex-col bg-linear-to-b from-[#7C3AED] to-[#A855F7] text-white transition-all duration-300 select-none z-30 shrink-0",
        isCollapsed ? "w-18" : "w-64",
      )}
    >
      {/* ─── Header: Logo + Toggle ─── */}
      <SidebarHeader />

      {/* ─── Navigation ─── */}
      <div className="flex-1 overflow-y-auto overflow-x-hidden px-3 py-3 scrollbar-none">
        <SidebarNav items={NAV_ITEMS} />
      </div>

      {/* ─── Footer ─── */}
      <SidebarFooter />
    </aside>
  );
};

export default Sidebar;
export { Sidebar };
