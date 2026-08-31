"use client";

import { ChevronDown } from "lucide-react";
import { useAuth } from "@/modules/auth/context/AuthContext";

const NavbarUserProfile = () => {
  const { user } = useAuth();

  const initials = user?.initials || "FL";
  const displayName = user?.name || user?.email || "Account";
  const roleLabel = user?.roleLabel || "Member";

  return (
    <div className="flex items-center gap-3 cursor-pointer rounded-xl px-2 py-1.5 transition-colors hover:bg-slate-50">
      {/* Avatar */}
      <div className="flex size-8 items-center justify-center rounded-full bg-[#EDE9FE] text-xs font-bold text-[#7C3AED]">
        {initials}
      </div>

      <div className="flex flex-col text-left">
        <span className="text-sm font-semibold text-slate-800 leading-tight">
          {displayName}
        </span>
        <span className="text-[11px] text-slate-400 leading-tight">
          {roleLabel}
        </span>
      </div>

      <ChevronDown className="size-4 text-slate-400 ml-1" />
    </div>
  );
};

export default NavbarUserProfile;
export { NavbarUserProfile };
