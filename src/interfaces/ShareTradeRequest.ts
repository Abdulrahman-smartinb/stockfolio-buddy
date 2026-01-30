export interface ShareTradeRequest {
  investor: string;
  tradeType: string;
  sourceType: string;
  source: string;
  numberOfShares: number;
  pricePerShare: number;
  description: string;
  paymentStatus: string;
  requestStatus: string;
  rejectionReason: string;
}

export interface ShareTradeRequestLog {
  tradeRequest: string;
  action: string;
  performedBy: string;
  performedByType: string;
  previousStatus: string;
  newStatus: string;
  note: string;
}
