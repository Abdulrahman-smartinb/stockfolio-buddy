export interface CreatePurchaseRequestPayload {
  investorId: string;
  type: string;
  shares: number;
  sharePrice: number;
  description?: string;
  paymentStatus: string;
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

export interface PendingRequestItem {
  _id: string;
  investorId?: string;
  type?: string;
  shares?: number;
  sharePrice?: number;
  description?: string;
  paymentStatus?: string;
  status?: string;
  createdAt: string;
}
export interface PendingRequests {
  status: boolean;
  message: string;
  data: PendingRequestItem[];
}
