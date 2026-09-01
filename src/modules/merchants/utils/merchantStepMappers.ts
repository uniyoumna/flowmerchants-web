import {
  appendFile,
  appendJson,
  appendText,
  parseJsonList,
} from "@/utils/formData";
import {
  MERCHANT_AGREEMENT_DEFAULTS,
  type MerchantAgreementValues,
} from "../schemas/merchantAgreementSchema";
import {
  type BankAccountValues,
  MERCHANT_BANK_ACCOUNTS_DEFAULTS,
  type MerchantBankAccountsValues,
} from "../schemas/merchantBankAccountsSchema";
import {
  MERCHANT_COMMERCIAL_DEFAULTS,
  type MerchantCommercialValues,
} from "../schemas/merchantCommercialSchema";
import {
  type AccountManagerValues,
  type EscalationContactValues,
  MERCHANT_CONTACTS_DEFAULTS,
  type MerchantContactsValues,
} from "../schemas/merchantContactsSchema";
import type {
  ApiMerchantAgreement,
  ApiMerchantBankAccounts,
  ApiMerchantCommercialConfig,
  ApiMerchantContacts,
} from "../types";

/**
 * Form values ↔ multipart body for wizard steps 2 to 5.
 *
 * Each step has one builder (write) and one mapper (read). The read direction
 * always falls back to the step's blank defaults so a form never flips from
 * controlled to uncontrolled on a missing key.
 */

// ─── Step 2 — Agreement ──────────────────────────────────────────────────────

export function buildAgreementFormData(
  values: MerchantAgreementValues,
): FormData {
  const formData = new FormData();

  appendFile(formData, "signed_agreement", values.signedAgreement);
  appendText(formData, "agreement_reference", values.agreementReference);
  appendText(formData, "signature_date", values.signatureDate);
  appendText(formData, "effective_date", values.effectiveDate);

  return formData;
}

export function mapApiAgreement(
  api: ApiMerchantAgreement,
): MerchantAgreementValues {
  const defaults = MERCHANT_AGREEMENT_DEFAULTS;

  return {
    signedAgreement: api.signed_agreement ?? defaults.signedAgreement,
    agreementReference: api.agreement_reference ?? defaults.agreementReference,
    signatureDate: api.signature_date ?? defaults.signatureDate,
    effectiveDate: api.effective_date ?? defaults.effectiveDate,
  };
}

// ─── Step 3 — Operational contacts ───────────────────────────────────────────

type ApiEscalationContact = {
  full_name?: string;
  role?: string;
  email?: string;
  phone?: string;
  escalation_level?: string | number;
};

type ApiAccountManager = {
  full_name?: string;
  email?: string;
  phone?: string;
  is_primary?: boolean;
};

export function buildContactsFormData(
  values: MerchantContactsValues,
): FormData {
  const formData = new FormData();

  appendText(formData, "finance_contact_email", values.financeEmail);

  appendJson(
    formData,
    "escalation_contacts",
    values.escalationContacts.map((contact) => ({
      full_name: contact.fullName.trim(),
      role: contact.role.trim(),
      email: contact.email.trim(),
      phone: contact.phone.trim(),
      escalation_level: contact.level,
    })),
  );

  appendJson(
    formData,
    "account_managers",
    values.accountManagers.map((manager) => ({
      full_name: manager.fullName.trim(),
      email: manager.email.trim(),
      phone: manager.phone.trim(),
      is_primary: Boolean(manager.isPrimary),
    })),
  );

  return formData;
}

export function mapApiContacts(
  api: ApiMerchantContacts,
): MerchantContactsValues {
  const defaults = MERCHANT_CONTACTS_DEFAULTS;

  const escalationContacts: EscalationContactValues[] =
    parseJsonList<ApiEscalationContact>(api.escalation_contacts).map(
      (contact) => ({
        fullName: contact.full_name ?? "",
        role: contact.role ?? "",
        email: contact.email ?? "",
        phone: contact.phone ?? "",
        level: String(contact.escalation_level ?? "1"),
      }),
    );

  const accountManagers: AccountManagerValues[] =
    parseJsonList<ApiAccountManager>(api.account_managers).map((manager) => ({
      fullName: manager.full_name ?? "",
      email: manager.email ?? "",
      phone: manager.phone ?? "",
      isPrimary: Boolean(manager.is_primary),
    }));

  return {
    financeEmail: api.finance_contact_email ?? defaults.financeEmail,
    // A saved step with no rows would render an empty field array, which reads
    // as a broken form — fall back to one blank row.
    escalationContacts: escalationContacts.length
      ? escalationContacts
      : defaults.escalationContacts,
    accountManagers: accountManagers.length
      ? accountManagers
      : defaults.accountManagers,
  };
}

// ─── Step 4 — Bank accounts ──────────────────────────────────────────────────

type ApiBankAccount = {
  bank_name?: string;
  bank_branch?: string;
  account_holder_name?: string;
  account_type?: string;
  country?: string;
  currency?: string;
  phone?: string;
  account_number?: string;
  iban?: string;
  swift?: string;
  is_frozen?: boolean;
  is_default?: boolean;
};

export function buildBankAccountsFormData(
  values: MerchantBankAccountsValues,
): FormData {
  const formData = new FormData();

  appendJson(
    formData,
    "bank_accounts",
    values.accounts.map((account) => ({
      bank_name: account.bankName,
      bank_branch: account.bankBranch.trim(),
      account_holder_name: account.accountHolderName.trim(),
      account_type: account.accountType,
      country: account.country,
      currency: account.currency,
      phone: account.phone?.trim() ?? "",
      account_number: account.accountNumber.trim(),
      iban: account.iban.trim(),
      swift: account.swift?.trim() ?? "",
      is_frozen: Boolean(account.isFrozen),
      is_default: Boolean(account.isDefault),
      // Confirmation fields are an input control (FE-042), not stored data.
    })),
  );

  return formData;
}

export function mapApiBankAccounts(
  api: ApiMerchantBankAccounts,
): MerchantBankAccountsValues {
  const accounts: BankAccountValues[] = parseJsonList<ApiBankAccount>(
    api.bank_accounts,
  ).map((account) => ({
    bankName: account.bank_name ?? "",
    bankBranch: account.bank_branch ?? "",
    accountHolderName: account.account_holder_name ?? "",
    accountType: account.account_type ?? "",
    country: account.country ?? "",
    currency: account.currency ?? "",
    phone: account.phone ?? "",
    accountNumber: account.account_number ?? "",
    iban: account.iban ?? "",
    swift: account.swift ?? "",
    isFrozen: Boolean(account.is_frozen),
    isDefault: Boolean(account.is_default),
    // Re-seeded from the stored values so an untouched account stays valid
    // when the step is saved again.
    confirmAccountNumber: account.account_number ?? "",
    confirmIban: account.iban ?? "",
  }));

  return accounts.length ? { accounts } : MERCHANT_BANK_ACCOUNTS_DEFAULTS;
}

// ─── Step 5 — Commercial configuration ───────────────────────────────────────

export function buildCommercialFormData(
  values: MerchantCommercialValues,
): FormData {
  const formData = new FormData();

  appendText(formData, "currency", values.currency);
  appendText(formData, "min_ticket_size", values.minTicketSize);
  appendText(formData, "max_ticket_size", values.maxTicketSize);
  appendText(formData, "max_branches", values.maxBranches);
  appendText(formData, "max_sales_persons", values.maxSalesPersons);

  return formData;
}

export function mapApiCommercial(
  api: ApiMerchantCommercialConfig,
): MerchantCommercialValues {
  const defaults = MERCHANT_COMMERCIAL_DEFAULTS;

  return {
    currency: api.currency ?? defaults.currency,
    minTicketSize: api.min_ticket_size ?? defaults.minTicketSize,
    maxTicketSize: api.max_ticket_size ?? defaults.maxTicketSize,
    maxBranches: api.max_branches ?? defaults.maxBranches,
    maxSalesPersons: api.max_sales_persons ?? defaults.maxSalesPersons,
  };
}
