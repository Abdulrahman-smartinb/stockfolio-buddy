import { baseApi } from "./baseApi";
import {
  loginEP,
  logoutEP,
  profileEP,
  registerEP,
  verifyPinEP,
} from "../../api/GlobalData";
import { UserData } from "@/interfaces/UserData";

export interface LoginRequest {
  phone: string;
  pinCode: string;
}

export interface RegisterRequest {
  fullName: string;
  phone: string;
  pinCode: string;
  password: string;
  country: string;
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
    resolveRole: builder.query({
      query: ({ authUserId }) => {
        return `${profileEP}/check-role/${authUserId}`;
      },
    }),
    verifyPin: builder.mutation({
      query: (data) => ({
        url: verifyPinEP,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useResolveRoleQuery,
  useVerifyPinMutation,
} = authApi;
