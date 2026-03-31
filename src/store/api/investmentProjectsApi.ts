import { investmentProjectEP } from "@/api/GlobalData";
import { baseApi } from "./baseApi";
import {
  GetInvestmentProjectsParams,
  InvestmentProject,
  InvestmentProjectListResponse,
  SingleInvestmentProjectResponse,
} from "@/interfaces/investmentProject";

export const investmentProjectApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getInvestmentProjects: builder.query<
      InvestmentProject[],
      GetInvestmentProjectsParams | void
    >({
      query: (args) => {
        const { keyword, page, limit, sort, category, status, tags } =
          args || {};

        const params = new URLSearchParams();

        if (keyword) params.append("keyword", keyword);
        if (page !== undefined) params.append("page", String(page));
        if (limit !== undefined) params.append("limit", String(limit));
        if (sort) params.append("sort", sort);
        if (category) params.append("category", category);
        params.append("status", "published");
        if (tags?.length) params.append("tags", JSON.stringify(tags));

        const queryString = params.toString();

        return {
          url: queryString
            ? `${investmentProjectEP}?${queryString}`
            : investmentProjectEP,
        };
      },
      transformResponse: (response: InvestmentProjectListResponse) =>
        response.data,
      providesTags: ["InvestmentProject"],
    }),
    getInvestmentProjectFilters: builder.query<
      { data: { categories: any[]; tags: any[] } },
      { status?: string }
    >({
      query: ({ status } = {}) => {
        const params = new URLSearchParams();

        if (status) params.append("status", status);

        return `${investmentProjectEP}/filters?${params.toString()}`;
      },
    }),
    getOneInvestmentProject: builder.query<InvestmentProject, { id: string }>({
      query: ({ id }) => `${investmentProjectEP}/${id}`,
      transformResponse: (response: SingleInvestmentProjectResponse) =>
        response.data,
      providesTags: (result, error, { id }) => [
        { type: "InvestmentProject", id },
      ],
    }),
  }),
});

export const {
  useGetInvestmentProjectsQuery,
  useGetInvestmentProjectFiltersQuery,
  useGetOneInvestmentProjectQuery,
} = investmentProjectApi;
