import {
  investorSharesEP,
  sharePurchaseRequestEP,
  stocksEP,
} from "@/api/GlobalData";
import { baseApi } from "./baseApi";

export interface InvestmentCompany {
  _id: string;
  companyName: string;
  email?: string;
  description?: string;
  industry?: string;
  country?: string;

  valuation?: number;
  sharePrice?: number;
  totalShares?: number;
  availableShares?: number;

  currency?: string;
  logo?: string;
  website?: string;
  status?: string;
  bankQR?: [
    { name?: string; accountNumber?: string; qrCode?: string; _id?: string }
  ];

  foundersArray?: {
    investorId: string;
    shares: number;
  }[];

  companyId: string;

  createdAt: string;
  updatedAt: string;
  id: string;
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  marketCap: string;
}

interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
}

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
  companyId: string;
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
  companyId?: string;
  paymentStatus?: string;
  status?: string;
  createdAt: string;
}
export interface PendingRequests {
  status: boolean;
  message: string;
  data: PendingRequestItem[];
}

export const stocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all investment companies
    getStocks: builder.query<InvestmentCompany[], { companyId: string }>({
      query: ({ companyId }) => ({
        url: stocksEP,
        params: { companyId },
      }),
      transformResponse: (response: ApiResponse<InvestmentCompany[]>) =>
        response.data,
      providesTags: ["Stocks"],
    }),

    // Get one investment company
    getStock: builder.query<
      InvestmentCompany,
      { id: string; companyId: string }
    >({
      query: ({ id, companyId }) => ({
        url: `${stocksEP}/${id}`,
        params: { companyId },
      }),
      transformResponse: (response: ApiResponse<InvestmentCompany>) =>
        response.data,
      providesTags: (result, error, { id }) => [{ type: "Stocks", id }],
    }),

    // Create purchase request
    createPurchaseRequest: builder.mutation<
      any,
      { companyId: string; data: CreatePurchaseRequestPayload }
    >({
      query: ({ companyId, data }) => ({
        url: sharePurchaseRequestEP,
        method: "POST",
        params: { companyId },
        body: data,
      }),
      invalidatesTags: ["Stocks"],
    }),
    getPurchaseHistory: builder.query<
      PurchaseHistory,
      { id: string; page: number; limit: number }
    >({
      query: ({ id, page, limit }) =>
        `${investorSharesEP}/${id}?page=${page}&limit=${limit}`,
      providesTags: ["Stocks"],
    }),
    getInvestorPurchaseRequests: builder.query<PurchaseHistory, string>({
      query: (id) => `${sharePurchaseRequestEP}/investor/${id}`,
      providesTags: ["Stocks"],
    }),
  }),
});

export const {
  useGetStocksQuery,
  useGetStockQuery,
  useCreatePurchaseRequestMutation,
  useGetPurchaseHistoryQuery,
  useGetInvestorPurchaseRequestsQuery,
} = stocksApi;
