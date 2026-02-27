import { base_url } from "@/api/GlobalData";
import { fetchBaseQuery } from "@reduxjs/toolkit/query";
import Cookies from "js-cookie";

const rawBaseQuery = fetchBaseQuery({
  baseUrl: base_url,
  prepareHeaders: (headers) => {
    const token = Cookies.get("authToken");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

export const baseQueryWithAuth = async (args, api, extraOptions) => {
  const result = await rawBaseQuery(args, api, extraOptions);

  if (result.error) {
    const status = result.error.status || result.error.statsCode;
    const message = result.error.data?.message;

    const isSessionExpired =
      status === 401 ||
      message === "Session expired. Please log in again." ||
      message === "Token expired or invalid";

    if (isSessionExpired) {
      Cookies.remove("authToken");
      api.dispatch({ type: "auth/logout" });
      window.location.href = "/auth?reason=expired";
    }
  }

  return result;
};
