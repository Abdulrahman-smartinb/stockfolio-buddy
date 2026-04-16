// src/rtk/Investment/shareTransactionApi.ts

import { ShareTransactionEP } from "@/api/GlobalData";
import { baseApi } from "../baseApi";

/* ========= Types ========= */

export type ShareSide = "buy" | "sell";

export interface ShareTransaction {
  _id: string;
  assetId: string;
  assetType: string;
  holderId: string;
  holderType: string;
  side: ShareSide;
  quantity: number;
  pricePerShare: number;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalItems: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginatedShareTransactionsResponse {
  data: ShareTransaction[];
  pagination: PaginationMeta;
}

export interface GetShareTransactionsParams {
  page?: number;
  limit?: number;
  sort?: string;
  assetId?: string;
  holderId?: string;
  side?: ShareSide;
}

export interface GetFundTransactionsParams extends GetShareTransactionsParams {
  assetType?: string;
  holderType?: string;
  type?: string;
  startDate?: string;
  endDate?: string;
}

export interface ShareNetTimelineItem {
  date: string;
  total: number;
}

export interface GetShareNetParams {
  assetType: string;
  assetId: string;
  startDate?: string;
  endDate?: string;
}

/* ========= API ========= */

export const shareTransactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShareTransactions: builder.query<
      PaginatedShareTransactionsResponse,
      GetShareTransactionsParams
    >({
      query: ({
        page = 1,
        limit = 10,
        sort = "-createdAt",
        assetId,
        holderId,
        side,
      } = {}) => {
        const params = new URLSearchParams({
          page: String(page),
          limit: String(limit),
          sort,
        });

        if (assetId) params.set("assetId", assetId);
        if (holderId) params.set("holderId", holderId);
        if (side) params.set("side", side);

        return `${ShareTransactionEP}?${params.toString()}`;
      },
      providesTags: ["ShareTransaction"],
    }),

    getFundTransactions: builder.query<
      PaginatedShareTransactionsResponse,
      GetFundTransactionsParams
    >({
      query: ({
        page = 1,
        limit = 10,
        sort = "-createdAt",

        assetType = "InvestmentFund",
        assetId,

        holderType,
        holderId,

        type,
        side,

        startDate,
        endDate,
      }) => {
        const params = new URLSearchParams();

        params.set("page", String(page));
        params.set("limit", String(limit));
        if (sort) params.set("sort", sort);

        if (assetType) params.set("assetType", assetType);
        if (assetId) params.set("assetId", assetId);

        if (holderType) params.set("holderType", holderType);
        if (holderId) params.set("holderId", holderId);

        if (type) params.set("type", type);
        if (side) params.set("side", side);

        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);

        return `${ShareTransactionEP}?${params.toString()}`;
      },
      providesTags: (result) =>
        result?.data
          ? [
              ...result.data.map((tx) => ({
                type: "ShareTransaction",
                id: tx._id,
              })),
              { type: "ShareTransaction", id: "LIST" },
            ]
          : [{ type: "ShareTransaction", id: "LIST" }],
    }),
    getShareNetInvestment: builder.query<
      { data: ShareNetTimelineItem[] },
      GetShareNetParams
    >({
      query: ({ assetType, assetId, startDate, endDate }) => {
        const params = new URLSearchParams();

        params.set("assetType", assetType);
        params.set("assetId", assetId);

        if (startDate) params.set("startDate", startDate);
        if (endDate) params.set("endDate", endDate);

        return `api/shares/net-investment?${params.toString()}`;
      },

      providesTags: (result, error, arg) => [
        { type: "ShareTransaction", id: arg.assetId },
      ],
    }),
  }),
  overrideExisting: false,
});

/* ========= Hooks ========= */

export const {
  useGetShareTransactionsQuery,
  useGetFundTransactionsQuery,
  useGetShareNetInvestmentQuery,
} = shareTransactionApi;
