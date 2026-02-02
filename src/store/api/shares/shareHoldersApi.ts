import { sharesholdingEP } from "@/api/GlobalData";
import { baseApi } from "../baseApi";

export const shareHoldersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShareHolderStatics: builder.query({
      query: ({ holderType, holderId }) => ({
        url: `${sharesholdingEP}/sharesSummary`,
        params: { holderType, holderId },
      }),
    }),
  }),
});

export const { useGetShareHolderStaticsQuery } = shareHoldersApi;
