"use client";

import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useAuth } from "@/modules/auth/context/AuthContext";
import type { NavItem } from "@/modules/dashboard/types";
import { SidebarNavItem } from "./SidebarNavItem";

type SidebarNavProps = {
  items: NavItem[];
};

const SidebarNav = ({ items }: SidebarNavProps) => {
  const pathname = usePathname();
  const { user } = useAuth();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  // Filter items and their sub-items by current user's role
  const visibleItems = useMemo(() => {
    return items
      .filter((item) => !item.roles || item.roles.includes(user.role))
      .map((item) => {
        if (!item.children) return item;

        const filteredChildren = item.children.filter(
          (child) => !child.roles || child.roles.includes(user.role),
        );

        return { ...item, children: filteredChildren };
      })
      .filter((item) => !item.children || item.children.length > 0);
  }, [items, user.role]);

  // Keep the current route's parent section expanded
  useEffect(() => {
    const matchingIndex = visibleItems.findIndex((item) => {
      if (item.href === pathname) return true;

      return item.children?.some((child) => child.href === pathname);
    });

    if (matchingIndex !== -1) {
      setOpenIndex(matchingIndex);
    } else if (visibleItems.length > 0) {
      setOpenIndex(0);
    }
  }, [pathname, visibleItems]);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <nav className="flex flex-col gap-1.5">
      {visibleItems.map((item, index) => (
        <SidebarNavItem
          key={item.label}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => handleToggle(index)}
        />
      ))}
    </nav>
  );
};

export default SidebarNav;
export { SidebarNav };
export type { SidebarNavProps };
