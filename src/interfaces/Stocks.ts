export interface CreatePurchaseRequestPayload {
  investorId: string;
  type: string;
  shares: number;
  sharePrice: number;
  description?: string;
  paymentStatus: string;
  seller: string;
}

export interface PurchaseHistoryItem {
  _id: string;
  investorId: string;
  counterpartyId: string;
  type: string;
  shares: number;
  sharePrice: number;
  purchaseValue: number;
  description?: string;
  createdAt: string;
  updatedAt: string;
}
export interface PurchaseHistory {
  status: boolean;
  message: string;
  data: PurchaseHistoryItem[];
  totalPages: number;
}

// interfaces/Stocks.ts (or wherever)
export interface PendingRequestItem {
  _id: string;

  tradeType: "buy" | "sell";
  numberOfShares: number;
  pricePerShare: number;

  requestStatus: "pending" | "approved" | "rejected";
  paymentStatus: "paid" | "unpaid";

  createdAt: string;

  sourceType: "ClientCompany" | "InvestmentFund";
  source?: {
    _id: string;
    fullLegalName?: string;
    tradeName?: string;
    crn?: string;
  };
}

export interface PendingRequests {
  status: boolean;
  message: string;
  data: PendingRequestItem[];
}
