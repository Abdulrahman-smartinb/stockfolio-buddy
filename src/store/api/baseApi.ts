import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Dummy base URL - replace with your real API
const BASE_URL = "https://api.example.com/v1";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = localStorage.getItem("authToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ["Stocks", "Portfolio", "User"],
  endpoints: () => ({}),
});
