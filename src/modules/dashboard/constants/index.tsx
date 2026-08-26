import {
  AlignLeft,
  ArrowUpDown,
  Columns2,
  CreditCard,
  TriangleAlert,
  Users,
} from "lucide-react";
import type { NavItem } from "@/modules/dashboard/types";

const NAV_ITEMS: NavItem[] = [
  {
    label: "Merchants",
    icon: <Columns2 className="size-5" />,
    roles: ["super_admin", "merchant_acquisition", "compliance"],
    children: [
      {
        label: "New",
        href: "/merchants/new",
        roles: ["super_admin", "merchant_acquisition"],
      },
      {
        label: "Compliance Queue",
        href: "/merchants/compliance",
        badge: 3,
        roles: ["super_admin", "compliance"],
      },
      {
        label: "List of Merchants",
        href: "/merchants",
        roles: ["super_admin", "merchant_acquisition"],
      },
    ],
  },
  {
    label: "Settlements",
    icon: <ArrowUpDown className="size-5" />,
    roles: ["super_admin", "finance"],
    children: [
      {
        label: "List of Settlements",
        href: "/settlements",
        badge: 2,
        roles: ["super_admin", "finance"],
      },
      {
        label: "Reports",
        href: "/settlements/reports",
        roles: ["super_admin", "finance"],
      },
    ],
  },
  {
    label: "Transactions",
    icon: <AlignLeft className="size-5" />,
    roles: ["super_admin", "merchant_acquisition", "finance"],
    children: [
      { label: "All", href: "/transactions" },
      { label: "Purchases", href: "/transactions/purchases" },
      { label: "Refund", href: "/transactions/refund" },
    ],
  },
  {
    label: "Risk Flag",
    icon: <TriangleAlert className="size-5" />,
    roles: ["super_admin", "compliance"],
    children: [
      {
        label: "Flags",
        href: "/risk-flag",
        badge: 3,
        roles: ["super_admin", "compliance"],
      },
    ],
  },
  {
    label: "Finance Config",
    icon: <CreditCard className="size-5" />,
    roles: ["super_admin", "finance"],
    children: [
      {
        label: "Merchant Configuration",
        href: "/finance/configuration",
        roles: ["super_admin", "finance"],
      },
      {
        label: "Merchant Wallet",
        href: "/finance/wallet",
        roles: ["super_admin", "finance"],
      },
    ],
  },
  {
    label: "Team",
    icon: <Users className="size-5" />,
    roles: ["super_admin"],
    children: [
      { label: "Members", href: "/team", roles: ["super_admin"] },
      { label: "Invite Member", href: "/team/invite", roles: ["super_admin"] },
    ],
  },
];

export { NAV_ITEMS };
