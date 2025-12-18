import { baseApi } from "./baseApi";
import { loginEP, logoutEP, registerEP } from "../../api/GlobalData";

export interface LoginRequest {
  phoneNumber: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phoneNumber: string;
  password: string;
  companyId: string;
}

export interface AuthResponse {
  user: UserData;
  token: string;
}

export interface UserData {
  _id: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  ownedShares: number;
  companyId?: string;
  active: boolean;
  profileImage?: string;
  birthDate?: string;
  createdAt?: string;
}

export interface LogoutResponse {
  message: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: loginEP,
        method: "POST",
        body: credentials,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
          console.error("Login failed:", error);
        }
      },
    }),
    logout: builder.mutation<LogoutResponse, void>({
      query: () => ({
        url: logoutEP,
        method: "POST",
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          await queryFulfilled;

          // Clear local state
          localStorage.removeItem("authToken");
          localStorage.removeItem("user");
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: registerEP,
        method: "POST",
        body: userData,
      }),
      async onQueryStarted(_, { queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          localStorage.setItem("authToken", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
        } catch (error) {
          console.error("Registration failed:", error);
        }
      },
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  authApi;
