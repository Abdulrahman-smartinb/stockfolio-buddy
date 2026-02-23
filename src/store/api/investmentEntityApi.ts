import { investmentEntityEP, investmentFundsEP } from "@/api/GlobalData";
import { baseApi } from "./baseApi";
import { InvestmentEntity } from "@/interfaces/InvestmentEntity";
import { ApiResponse } from "@/interfaces/Global";

export const investmentEntityApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all investment companies
    getInvestmentEntities: builder.query<
      InvestmentEntity[],
      {
        keyword?: string;
        page?: number;
        limit?: number;
        sort?: string;
      }
    >({
      query: ({ keyword, page, limit, sort } = {}) => {
        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page !== undefined) params.append("page", String(page));
        if (limit !== undefined) params.append("limit", String(limit));
        if (sort) params.append("sort", sort);

        const queryString = params.toString();

        return {
          url: queryString
            ? `${investmentEntityEP}?${queryString}`
            : investmentEntityEP,
        };
      },
      transformResponse: (response: ApiResponse<InvestmentEntity[]>) =>
        response.data,
      providesTags: ["InvestmentEntities"],
    }),
    getOneEntity: builder.query({
      query: ({ id }) => `${investmentFundsEP}/${id}`,
    }),
  }),
});

export const { useGetInvestmentEntitiesQuery, useGetOneEntityQuery } =
  investmentEntityApi;
