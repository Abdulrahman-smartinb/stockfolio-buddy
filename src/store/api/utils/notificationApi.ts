import { notificationEP } from "@/api/GlobalData";
import { baseApi } from "../baseApi";
import { ApiResponse } from "@/interfaces/Global";
import { Notification } from "@/interfaces/Notification";

export const notificationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMyNotifications: builder.query({
      query: ({ id, page = 1, limit = 10, isRead = "false" }) =>
        `${notificationEP}?id=${id}&page=${page}&limit=${limit}&isRead=${isRead}`,
      transformResponse: (response: ApiResponse<Notification[]>) =>
        response.data,
      providesTags: ["Notification"],
    }),
    markAsRead: builder.mutation({
      query: ({ id, authUserId }) => ({
        url: `${notificationEP}/${id}/read?authUserId=${authUserId}`,
        method: "PATCH",
      }),
    }),
    markAllAsRead: builder.mutation({
      query: ({ authUserId }) => ({
        url: `${notificationEP}/read-all?authUserId=${authUserId}`,
        method: "PATCH",
      }),
    }),
  }),
});

export const {
  useGetMyNotificationsQuery,
  useMarkAsReadMutation,
  useMarkAllAsReadMutation,
} = notificationApi;
