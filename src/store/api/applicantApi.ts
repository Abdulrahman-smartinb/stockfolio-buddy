import { applicantsEP } from "@/api/GlobalData";
import { baseApi } from "./baseApi";

export const applicantApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOneApplicant: builder.query({
      query: ({ id }) => `${applicantsEP}/${id}`,
    }),
    updateApplicantProfile: builder.mutation({
      query: ({ id, data }) => ({
        url: `${applicantsEP}/profile/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetOneApplicantQuery, useUpdateApplicantProfileMutation } =
  applicantApi;
