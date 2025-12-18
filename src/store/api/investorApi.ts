import { companyId, investorEP } from "@/api/GlobalData";
import { baseApi } from "./baseApi";

export const stocksApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOneInvestor: builder.query({
      query: (id) => `${investorEP}/${id}?companyId=${companyId}`,
    }),
    updateInvestor: builder.mutation({
      query: ({ id, data }) => ({
        url: `${investorEP}/${id}?companyId=${companyId}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useUpdateInvestorMutation, useGetOneInvestorQuery } = stocksApi;
