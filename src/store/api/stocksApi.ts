import {
  investorSharesEP,
  sharePurchaseRequestEP,
  shareTradeRequestEP,
  stocksEP,
} from "@/api/GlobalData";
import { baseApi } from "./baseApi";
import { InvestmentCompany } from "@/interfaces/InvestmentCompany";
import {
  CreatePurchaseRequestPayload,
  PurchaseHistory,
} from "@/interfaces/Stocks";
import { ApiResponse } from "@/interfaces/Global";

export const stocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all investment companies
    getStocks: builder.query<
      InvestmentCompany[],
      {
        keyword?: string;
        page?: number;
        limit?: number;
        sort?: string;
      }
    >({
      query: ({ keyword, page, limit, sort } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page !== undefined) params.append("page", String(page));
        if (limit !== undefined) params.append("limit", String(limit));
        if (sort) params.append("sort", sort);

        const queryString = params.toString();

        return {
          url: queryString ? `${stocksEP}?${queryString}` : stocksEP,
        };
      },
      transformResponse: (response: ApiResponse<InvestmentCompany[]>) =>
        response.data,
      providesTags: ["Stocks"],
    }),

    // Get one investment company
    getStock: builder.query<InvestmentCompany, { id: string }>({
      query: ({ id }) => ({
        url: `${stocksEP}/${id}`,
        params: {},
      }),
      transformResponse: (response: ApiResponse<InvestmentCompany>) =>
        response.data,
      providesTags: (result, error, { id }) => [{ type: "Stocks", id }],
    }),

    // Create purchase request
    createPurchaseRequest: builder.mutation<
      any,
      { data: CreatePurchaseRequestPayload }
    >({
      query: ({ data }) => ({
        url: sharePurchaseRequestEP,
        method: "POST",
        params: {},
        body: data,
      }),
      invalidatesTags: ["Stocks"],
    }),
    getPurchaseHistory: builder.query<
      PurchaseHistory,
      { id: string; page: number; limit: number }
    >({
      query: ({ id, page, limit }) =>
        `${shareTradeRequestEP}/${id}?page=${page}&limit=${limit}`,
      providesTags: ["Stocks"],
    }),

    getInvestorPurchaseRequests: builder.query<PurchaseHistory, string>({
      query: (id) => {
        console.log("getInvestorPurchaseRequests id:", id);
        return `${shareTradeRequestEP}/investor/${id}`;
      },
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
