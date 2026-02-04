export interface Notification {
  _id: string;
  user: string;
  type: string;
  title?: string;
  message?: string;
  meta?: {
    tradeId: string;
    reason?: string;
    previousStatus?: string;
    newStatus?: string;
  };
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}
