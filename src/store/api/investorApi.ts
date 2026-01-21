import { investorEP } from "@/api/GlobalData";
import { baseApi } from "./baseApi";

export const stocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOneInvestor: builder.query({
      query: (id) => `${investorEP}/${id}`,
    }),
    updateInvestor: builder.mutation({
      query: ({ id, data }) => ({
        url: `${investorEP}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useUpdateInvestorMutation, useGetOneInvestorQuery } = stocksApi;
