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
  }),
  overrideExisting: false,
});

/* ========= Hooks ========= */

export const { useGetShareTransactionsQuery } = shareTransactionApi;
