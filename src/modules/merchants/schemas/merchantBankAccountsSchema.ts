import { z } from "zod";
import { DEFAULT_BANK_ACCOUNT_TYPE, DEFAULT_CURRENCY } from "../constants";

/** Step 4 — Settlement bank accounts  */

/** Comparison form for account numbers and IBANs: no spaces, upper case. */
function normalizeAccountId(value: string): string {
  return value.replace(/[\s-]/g, "").toUpperCase();
}

/**
 * country-aware IBAN structure plus the ISO 7064 mod-97 checksum.
 * Structure is validated generically; the checksum is what actually catches a
 * mistyped digit.
 */
function isValidIban(raw: string): boolean {
  const iban = normalizeAccountId(raw);
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) return false; // eg: GB29NWBK60161331926819

  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const numeric = rearranged.replace(/[A-Z]/g, (char) =>
    String(char.charCodeAt(0) - 55),
  );

  // The number is far beyond Number.MAX_SAFE_INTEGER, so fold mod 97 in chunks.
  let remainder = 0;
  for (const digit of numeric) {
    remainder = (remainder * 10 + Number(digit)) % 97;
  }

  return remainder === 1;
}

const bankAccountSchema = z
  .object({
    bankName: z.string().min(1, "Select a bank"),
    bankBranch: z.string().trim().min(2, "Enter the bank branch"),
    accountHolderName: z
      .string()
      .trim()
      .min(3, "Enter the account holder name"),
    accountType: z.string().min(1, "Select an account type"),
    country: z.string().min(1, "Select a country"),
    currency: z.string().min(1, "Select a currency"),
    phone: z.string().trim().default(""),

    accountNumber: z.string().trim().min(6, "Enter the account number"),
    confirmAccountNumber: z
      .string()
      .trim()
      .min(1, "Confirm the account number"),

    iban: z.string().trim().refine(isValidIban, "Enter a valid IBAN"),
    confirmIban: z.string().trim().min(1, "Confirm the IBAN"),

    swift: z
      .string()
      .trim()
      .default("")
      .refine(
        (value) =>
          value === "" || /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/i.test(value),
        "Enter a valid SWIFT / BIC code",
      ),

    /** FE-014 — frozen accounts stay on record but cannot receive settlement. */
    isFrozen: z.boolean().default(false),
    /** FE-046 — exactly one default account per settlement currency. */
    isDefault: z.boolean().default(false),
  })
  // FE-042 — confirmation is compared on the normalized value, so formatting
  // differences do not read as a mismatch.
  .refine(
    ({ accountNumber, confirmAccountNumber }) =>
      normalizeAccountId(accountNumber) ===
      normalizeAccountId(confirmAccountNumber),
    { message: "Account numbers do not match", path: ["confirmAccountNumber"] },
  )
  .refine(
    ({ iban, confirmIban }) =>
      normalizeAccountId(iban) === normalizeAccountId(confirmIban),
    { message: "IBANs do not match", path: ["confirmIban"] },
  );

const merchantBankAccountsSchema = z
  .object({
    accounts: z
      .array(bankAccountSchema)
      .min(1, "Register at least one settlement bank account"),
  })
  .superRefine(({ accounts }, ctx) => {
    // FE-045 — no duplicate active accounts for the same merchant.
    const seen = new Set<string>();
    for (const account of accounts) {
      const key = normalizeAccountId(account.iban);
      if (seen.has(key)) {
        ctx.addIssue({
          code: "custom",
          message: "This account is already registered",
          path: ["accounts"],
        });
        break;
      }
      seen.add(key);
    }

    // FE-046 — every settlement currency needs exactly one usable default.
    const byCurrency = new Map<string, number>();
    for (const account of accounts) {
      if (!account.isDefault || account.isFrozen) continue;
      byCurrency.set(
        account.currency,
        (byCurrency.get(account.currency) ?? 0) + 1,
      );
    }

    for (const currency of new Set(accounts.map((a) => a.currency))) {
      const defaults = byCurrency.get(currency) ?? 0;
      if (defaults !== 1) {
        ctx.addIssue({
          code: "custom",
          message: `Mark exactly one active default ${currency} account`,
          path: ["accounts"],
        });
        break;
      }
    }
  });

type MerchantBankAccountsValues = z.input<typeof merchantBankAccountsSchema>;
type BankAccountValues = MerchantBankAccountsValues["accounts"][number];

const EMPTY_BANK_ACCOUNT: BankAccountValues = {
  bankName: "",
  bankBranch: "",
  accountHolderName: "",
  accountType: DEFAULT_BANK_ACCOUNT_TYPE,
  country: "",
  currency: DEFAULT_CURRENCY,
  phone: "",
  accountNumber: "",
  confirmAccountNumber: "",
  iban: "",
  confirmIban: "",
  swift: "",
  isFrozen: false,
  isDefault: false,
};

const MERCHANT_BANK_ACCOUNTS_DEFAULTS: MerchantBankAccountsValues = {
  accounts: [],
};

export {
  bankAccountSchema,
  EMPTY_BANK_ACCOUNT,
  isValidIban,
  MERCHANT_BANK_ACCOUNTS_DEFAULTS,
  merchantBankAccountsSchema,
  normalizeAccountId,
};
export type { BankAccountValues, MerchantBankAccountsValues };
