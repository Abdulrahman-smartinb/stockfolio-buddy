export interface TransactionItem {
  type: string;
  shares: number;
  sharePrice: number;
  purchaseValue: number;
  createdAt: string;
}

export interface TransactionHistoryProps {
  isLoading: boolean;
  data?: TransactionItem[];
  page?: number;
  setPage?: any;
  limit?: number;
  setLimit?: any;
  totalPages?: number;
}
