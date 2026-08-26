export type MerchantStatus =
  | "Active"
  | "Draft"
  | "Pending Compliance"
  | "Pending Finance"
  | "Blocked"
  | "Grace Period"
  | "Deactivated";

export type Merchant = {
  id: string;
  name: string;
  arabicName: string;
  code: string | null;
  products: string[] | null;
  businessType: string;
  owner: string;
  branches: string;
  expiry: string | null;
  joiningDate: string;
  status: MerchantStatus;
};

export type MerchantsQueryParams = {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  sortBy?: string;
};

export type MerchantsApiResponse = {
  data: Merchant[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
};
