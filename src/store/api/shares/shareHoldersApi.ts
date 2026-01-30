import { sharesholdingEP } from "@/api/GlobalData";
import { baseApi } from "../baseApi";

export const shareHoldersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getShareHolderStatics: builder.query({
      query: ({ id }) => `${sharesholdingEP}/${id}`,
    }),
  }),
});

export const { useGetShareHolderStaticsQuery } = shareHoldersApi;
