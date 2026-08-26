"use client";

import { LogOut, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/modules/auth/context/AuthContext";
import { useSidebar } from "@/modules/dashboard/hooks/useSidebar";

const SidebarFooter = () => {
  const { isCollapsed } = useSidebar();
  const { logout } = useAuth();

  return (
    <div
      className={cn(
        "border-t border-white/15 p-4",
        isCollapsed
          ? "flex justify-center"
          : "flex items-center justify-between",
      )}
    >
      {!isCollapsed && (
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-full bg-white/20 text-white shadow-xs">
            <Sparkles className="size-4" />
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-normal text-white/70">
              Powered by
            </span>
            <span className="text-xs font-semibold text-white">
              Uniparticle
            </span>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={logout}
        className="flex items-center justify-center rounded-lg p-2 text-white/70 transition-colors hover:bg-white/10 hover:text-white cursor-pointer"
        aria-label="Logout"
        title="Logout"
      >
        <LogOut className="size-5" />
      </button>
    </div>
  );
};

export default SidebarFooter;
export { SidebarFooter };
