export type UserRole =
  | "super_admin"
  | "merchant_acquisition"
  | "compliance"
  | "finance";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  roleLabel: string;
  initials: string;
  defaultRoute: string;
};

export const MOCK_USERS: Record<string, AuthUser> = {
  "admin@flow.eg": {
    id: "usr_super_admin",
    name: "Nour El-Admin",
    email: "admin@flow.eg",
    role: "super_admin",
    roleLabel: "Super Admin",
    initials: "NA",
    defaultRoute: "/merchants",
  },
  "sara.hassan@flow.eg": {
    id: "usr_acq_officer",
    name: "Sara Hassan",
    email: "sara.hassan@flow.eg",
    role: "merchant_acquisition",
    roleLabel: "Merchant Acquisition Officer",
    initials: "SH",
    defaultRoute: "/merchants",
  },
  "mostafa.ali@flow.eg": {
    id: "usr_compliance",
    name: "Mostafa Ali",
    email: "mostafa.ali@flow.eg",
    role: "compliance",
    roleLabel: "Compliance Officer",
    initials: "MA",
    defaultRoute: "/merchants/compliance",
  },
  "yara.selim@flow.eg": {
    id: "usr_finance",
    name: "Yara Selim",
    email: "yara.selim@flow.eg",
    role: "finance",
    roleLabel: "Flow Finance Officer",
    initials: "YS",
    defaultRoute: "/settlements",
  },
};
