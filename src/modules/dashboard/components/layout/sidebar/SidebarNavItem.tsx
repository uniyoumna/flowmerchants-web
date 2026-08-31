"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useSidebar } from "@/modules/dashboard/hooks/useSidebar";
import type { NavItem } from "@/modules/dashboard/types";

type SidebarNavItemProps = {
  item: NavItem;
  isOpen: boolean;
  onToggle: () => void;
};

const SidebarNavItem = ({ item, isOpen, onToggle }: SidebarNavItemProps) => {
  const pathname = usePathname();
  const { isCollapsed } = useSidebar();

  const hasChildren = Boolean(item.children && item.children.length > 0);

  // Check if this item or any of its children matches current path
  const isChildActive = hasChildren
    ? item.children?.some(
        (child) =>
          pathname === child.href ||
          (child.href === "/merchants" && pathname === "/"),
      )
    : pathname === item.href;

  const handleClick = () => {
    if (hasChildren) {
      onToggle();
    }
  };

  const itemContent = (
    <>
      <span className="shrink-0 text-white">{item.icon}</span>

      {!isCollapsed && (
        <>
          <span className="flex-1 text-left tracking-wide">{item.label}</span>
          {hasChildren && (
            <span className="text-white/70">
              {isOpen ? (
                <ChevronDown className="size-4 transition-transform duration-200" />
              ) : (
                <ChevronRight className="size-4 transition-transform duration-200" />
              )}
            </span>
          )}
        </>
      )}
    </>
  );

  const buttonClasses = cn(
    "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 cursor-pointer",
    isCollapsed ? "justify-center px-0 py-3" : "",
    isOpen || isChildActive
      ? "bg-white/20 text-white shadow-xs"
      : "text-white/80 hover:bg-white/10 hover:text-white",
  );

  return (
    <div className="w-full">
      {hasChildren ? (
        <button
          type="button"
          onClick={handleClick}
          className={buttonClasses}
          title={isCollapsed ? item.label : undefined}
        >
          {itemContent}
        </button>
      ) : (
        <Link
          href={item.href ?? "#"}
          className={buttonClasses}
          title={isCollapsed ? item.label : undefined}
        >
          {itemContent}
        </Link>
      )}

      {/* Sub-items with tree line */}
      {hasChildren && isOpen && !isCollapsed && (
        <div className="relative mt-1 ml-5 border-l border-white/20 pl-3.5 space-y-1 py-1">
          {item.children?.map((child) => {
            const isActive =
              pathname === child.href ||
              (child.href === "/merchants" && pathname === "/");

            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  "flex items-center justify-between rounded-xl px-3.5 py-2 text-sm transition-all duration-150",
                  isActive
                    ? "bg-white text-[#7C3AED] font-semibold shadow-sm"
                    : "text-white/80 hover:text-white hover:bg-white/10 font-normal",
                )}
              >
                <span className="truncate">{child.label}</span>
                {child.badge !== undefined && (
                  <span
                    className={cn(
                      "flex size-5 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
                      isActive
                        ? "bg-[#7C3AED]/15 text-[#7C3AED]"
                        : "bg-white/25 text-white",
                    )}
                  >
                    {child.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default SidebarNavItem;
export { SidebarNavItem };
export type { SidebarNavItemProps };
