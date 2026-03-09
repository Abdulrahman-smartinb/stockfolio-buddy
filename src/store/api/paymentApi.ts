import { jadwaBaseUrl, jadwaPaymentEP } from "@/api/GlobalData";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const onlinePaymentApi = createApi({
  reducerPath: "onlinePaymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: jadwaBaseUrl,
  }),
  tagTypes: ["OnlinePayment"],
  endpoints: (builder) => ({
    requestPaymentUrl: builder.mutation<
      any,
      { data: any; curr: string; token: string }
    >({
      query: ({ data, curr, token }) => ({
        url: jadwaPaymentEP,
        method: "POST",
        body: data,
        headers: {
          "Content-Type": "application/json",
          "x-jadwa-token": token,
          "accept-currency": curr,
        },
      }),
      invalidatesTags: ["OnlinePayment"],
    }),
  }),
});

export const { useRequestPaymentUrlMutation } = onlinePaymentApi;
