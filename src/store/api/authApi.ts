import { baseApi } from "./baseApi";
import { loginEP, logoutEP, registerEP } from "../../api/GlobalData";
import { UserData } from "@/interfaces/UserData";

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  password: string;
}

export interface AuthResponse {
  user: UserData;
  role: string;
  profile: UserData;
  token: string;
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
    }),
    logout: builder.mutation<LogoutResponse, string>({
      query: (id) => ({
        url: `${logoutEP}/${id}`,
        method: "POST",
      }),
    }),
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: registerEP,
        method: "POST",
        body: userData,
      }),
    }),
  }),
});

export const { useLoginMutation, useLogoutMutation, useRegisterMutation } =
  authApi;
