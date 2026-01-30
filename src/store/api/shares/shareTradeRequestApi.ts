import { shareTradeRequestEP } from "@/api/GlobalData";
import { baseApi } from "../baseApi";

export const shareTradeRequestApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOneShareTradeRequest: builder.query({
      query: ({ id }) => `${shareTradeRequestEP}/${id}`,
    }),
    getInvestorShareTradeRequests: builder.query({
      query: ({ id }) => `${shareTradeRequestEP}/investor/${id}`,
    }),
    createShareTradeRequest: builder.mutation({
      query: ({ data }) => ({
        url: `${shareTradeRequestEP}`,
        method: "POST",
        body: data,
      }),
    }),
    updateShareTradeRequest: builder.mutation({
      query: ({ id, data }) => ({
        url: `${shareTradeRequestEP}/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const {
  useGetOneShareTradeRequestQuery,
  useGetInvestorShareTradeRequestsQuery,
  useCreateShareTradeRequestMutation,
  useUpdateShareTradeRequestMutation,
} = shareTradeRequestApi;
