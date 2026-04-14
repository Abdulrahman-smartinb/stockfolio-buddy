import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryWithAuth } from "./baseQuery";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: baseQueryWithAuth,
  tagTypes: [
    "Stocks",
    "Portfolio",
    "User",
    "CompanyInfo",
    "InvestmentEntities",
    "Notification",
    "ShareTransaction",
    "InvestmentProject",
    "InvestmentEntity",
  ],
  endpoints: () => ({}),
});
