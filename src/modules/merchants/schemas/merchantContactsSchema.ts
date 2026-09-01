import { z } from "zod";

/**
 * Step 3 — Operational contacts
 *
 * Both collections are field arrays: complaint escalation needs one row per
 * tier, and a merchant can have several account managers of which exactly one
 * is primary.
 */

// TODO: source from the configurable-format endpoint.
const PHONE_PATTERN = /^(\+?20|0)?\d{8,11}$/;

const phoneField = z
  .string()
  .trim()
  .min(1, "Phone number is required")
  .refine(
    (value) => PHONE_PATTERN.test(value.replace(/[\s()-]/g, "")),
    "Enter a valid phone number",
  );

const escalationContactSchema = z.object({
  fullName: z.string().trim().min(3, "Enter the full name"),
  role: z.string().trim().min(2, "Enter the role or title"),
  email: z.email("Enter a valid email address"),
  phone: phoneField,
  level: z.string().min(1, "Select an escalation level"),
});

const accountManagerSchema = z.object({
  fullName: z.string().trim().min(3, "Enter the full name"),
  email: z.email("Enter a valid email address"),
  phone: phoneField,
  /** Exactly one manager carries this — enforced on the array below. */
  isPrimary: z.boolean().default(false),
});

const merchantContactsSchema = z
  .object({
    financeEmail: z.email("Enter a valid finance team email"),
    escalationContacts: z
      .array(escalationContactSchema)
      .min(1, "Add at least one escalation contact"),
    accountManagers: z
      .array(accountManagerSchema)
      .min(1, "Add at least one account manager"),
  })
  .refine(
    ({ escalationContacts }) =>
      new Set(escalationContacts.map((contact) => contact.level)).size ===
      escalationContacts.length,
    {
      message: "Each escalation level can only be used once",
      path: ["escalationContacts"],
    },
  )
  .refine(
    ({ accountManagers }) =>
      accountManagers.filter((manager) => manager.isPrimary).length === 1,
    {
      // the primary account manager is the one who receives the
      // activation invitation, so the choice cannot be ambiguous.
      message: "Mark exactly one account manager as primary",
      path: ["accountManagers"],
    },
  );

type MerchantContactsValues = z.input<typeof merchantContactsSchema>;
type EscalationContactValues =
  MerchantContactsValues["escalationContacts"][number];
type AccountManagerValues = MerchantContactsValues["accountManagers"][number];

const EMPTY_ESCALATION_CONTACT: EscalationContactValues = {
  fullName: "",
  role: "",
  email: "",
  phone: "",
  level: "1",
};

const EMPTY_ACCOUNT_MANAGER: AccountManagerValues = {
  fullName: "",
  email: "",
  phone: "",
  isPrimary: false,
};

const MERCHANT_CONTACTS_DEFAULTS: MerchantContactsValues = {
  financeEmail: "",
  escalationContacts: [{ ...EMPTY_ESCALATION_CONTACT }],
  // The only manager on a fresh step is necessarily the primary one.
  accountManagers: [{ ...EMPTY_ACCOUNT_MANAGER, isPrimary: true }],
};

export {
  EMPTY_ACCOUNT_MANAGER,
  EMPTY_ESCALATION_CONTACT,
  MERCHANT_CONTACTS_DEFAULTS,
  merchantContactsSchema,
};
export type {
  AccountManagerValues,
  EscalationContactValues,
  MerchantContactsValues,
};
