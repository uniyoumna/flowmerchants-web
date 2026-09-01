import type {
  WalletLedgerEntry,
  WalletMerchantOption,
  WalletStatus,
} from "../types";

/**
 * ⚠️ TEMPORARY — stand-in data for the merchant wallet screen.
 *
 * The wallet endpoints are not deployed yet. Delete this file and flip
 * `USE_MOCK_WALLET` in `walletService.ts` when they land — the view models and
 * every call site stay exactly as they are.
 */

type MockWallet = WalletMerchantOption & {
  status: WalletStatus;
  balance: number;
  pendingSettlement: number;
};

/**
 * Balance and pending vary per merchant; the ledger below is shared. Only an
 * active or grace-period merchant holds a spendable balance — the rest are
 * stopped earlier in the lifecycle, so their wallets sit at zero.
 */
export const MOCK_WALLETS: MockWallet[] = [
  {
    merchantId: "MCH-10042",
    merchantName: "Cairo Electronics Co.",
    merchantCode: "MCH-10042",
    status: "active",
    balance: 284500,
    pendingSettlement: 94200,
  },
  {
    merchantId: "MCH-10039",
    merchantName: "Nile Fashion Group",
    merchantCode: "MCH-10039",
    status: "active",
    balance: 128300,
    pendingSettlement: 45600,
  },
  {
    merchantId: "MCH-10051",
    merchantName: "Delta Home Appliances",
    merchantCode: "MCH-10051",
    status: "blocked",
    balance: 0,
    pendingSettlement: 22100,
  },
  {
    merchantId: "MCH-10028",
    merchantName: "Al-Ahram Auto Trading",
    merchantCode: "MCH-10028",
    status: "grace_period",
    balance: 67200,
    pendingSettlement: 31800,
  },
  {
    merchantId: "MCH-10058",
    merchantName: "Sphinx Furniture & Decor",
    merchantCode: "MCH-10058",
    status: "pending_compliance",
    balance: 0,
    pendingSettlement: 0,
  },
  {
    merchantId: "MCH-10063",
    merchantName: "Eastern Pharma Distribution",
    merchantCode: "MCH-10063",
    status: "pending_finance",
    balance: 0,
    pendingSettlement: 0,
  },
  {
    merchantId: "MCH-10031",
    merchantName: "Orascom Retail & Trading",
    merchantCode: "MCH-10031",
    status: "active",
    balance: 612400,
    pendingSettlement: 187500,
  },
  {
    merchantId: "MCH-10047",
    merchantName: "Medina Medical Centers",
    merchantCode: "MCH-10047",
    status: "no_eligible_branch",
    balance: 0,
    pendingSettlement: 0,
  },
  {
    merchantId: "MCH-10022",
    merchantName: "Giza Sports & Fitness",
    merchantCode: "MCH-10022",
    status: "deactivated",
    balance: 0,
    pendingSettlement: 4200,
  },
  {
    merchantId: "MCH-10071",
    merchantName: "Blue Nile Jewellery",
    merchantCode: "MCH-10071",
    status: "draft",
    balance: 0,
    pendingSettlement: 0,
  },
];

/** Newest movement first, the way a statement reads. */
export const MOCK_WALLET_LEDGER: WalletLedgerEntry[] = [
  {
    id: "WTX-001",
    date: "2025-01-08",
    description: "Settlement Disbursement",
    type: "outcome",
    amount: 264250,
    balanceAfter: 284500,
  },
  {
    id: "WTX-002",
    date: "2025-01-07",
    description: "Purchase Inflow",
    type: "income",
    amount: 148200,
    balanceAfter: 432700,
  },
  {
    id: "WTX-003",
    date: "2025-01-06",
    description: "Refund Reversal",
    type: "outcome",
    amount: 14200,
    balanceAfter: 418500,
  },
  {
    id: "WTX-004",
    date: "2025-01-05",
    description: "Purchase Inflow",
    type: "income",
    amount: 95600,
    balanceAfter: 514100,
  },
  {
    id: "WTX-005",
    date: "2025-01-04",
    description: "Admin Fee Deduction",
    type: "outcome",
    amount: 1800,
    balanceAfter: 512300,
  },
];
