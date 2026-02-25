import { companyId, companyInfoEP } from "@/api/GlobalData";
import { baseApi } from "./baseApi";
import { ApiResponse } from "@/interfaces/Global";
import { CompanyInfo } from "@/interfaces/CompanyInfo";

export const companyInfoApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all investment companies
    getCompanyInfo: builder.query<CompanyInfo, {}>({
      query: () => ({ url: companyInfoEP }),
      transformResponse: (response: ApiResponse<CompanyInfo>) => response.data,
      providesTags: ["CompanyInfo"],
    }),
  }),
});

export const { useGetCompanyInfoQuery } = companyInfoApi;
