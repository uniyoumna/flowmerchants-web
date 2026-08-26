"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import logo from "@/assets/icons/logo.svg";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/modules/dashboard/hooks/useSidebar";

const SidebarHeader = () => {
  const { isCollapsed, toggle } = useSidebar();

  return (
    <div
      className={cn(
        "flex items-center pt-5 pb-3 px-3 border-b border-white/20",
        isCollapsed ? "justify-center" : "justify-between",
      )}
    >
      {!isCollapsed ? (
        <>
          <div className="flex items-center gap-3 backdrop-blur-sm rounded-2xl px-3 py-2">
            <div className="flex size-10 items-center justify-center rounded-lg bg-white shadow-xs">
              <Image src={logo} alt="Flow logo" className="size-8" />
            </div>
            <span className="text-xl font-bold tracking-tight text-white">
              Flow
            </span>
          </div>

          <div className="relative group">
            <button
              type="button"
              onClick={toggle}
              className="flex size-9 items-center justify-center rounded-xl bg-white/15 text-white transition-colors hover:bg-white/25 cursor-pointer"
              aria-label="Collapse sidebar"
            >
              <ChevronLeft className="size-5" />
            </button>

            {/* Tooltip */}
            <div className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 rounded-md bg-neutral-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
              Collapse sidebar
            </div>
          </div>
        </>
      ) : (
        <div className="relative group">
          <button
            type="button"
            onClick={toggle}
            className="flex size-10 items-center justify-center rounded-xl bg-white/20 text-white transition-colors hover:bg-white/30 cursor-pointer shadow-xs"
            aria-label="Expand sidebar"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="pointer-events-none absolute left-full top-1/2 ml-2 -translate-y-1/2 rounded-md bg-neutral-900 px-2 py-1 text-xs whitespace-nowrap text-white opacity-0 shadow-md transition-opacity group-hover:opacity-100 z-50">
            Expand sidebar
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarHeader;
export { SidebarHeader };
