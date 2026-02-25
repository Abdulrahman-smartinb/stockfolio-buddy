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

export interface GetShareTransactionsParams {
  page?: number;
  limit?: number;
  sort?: string;
  assetId?: string;
  holderId?: string;
  side?: ShareSide;
}

/* ========= API ========= */

export const shareTransactionApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShareTransactions: builder.query<
      { data: ShareTransaction[] },
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
    getFundTransactions: builder.query({
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
  }),
  overrideExisting: false,
});

/* ========= Hooks ========= */

export const { useGetShareTransactionsQuery, useGetFundTransactionsQuery } =
  shareTransactionApi;
