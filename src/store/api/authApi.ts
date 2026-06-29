import { baseApi } from "./baseApi";
import {
  forgotPassEP,
  // investorEP,
  loginEP,
  logoutEP,
  profileEP,
  registerEP,
  resetPassEP,
  sendEmailVerificationEP,
  verifyEmailEP,
  // resendSmsEP,
  verifyPinEP,
  // verifySmsEP,
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

export interface ForgotPassRes {
  status: boolean;
  message: string;
  verificationRequired?: boolean;
}
export interface ForgotPassReq {
  email: string;
}

export interface ResetPassRes {
  status: boolean;
  message: string;
}
export interface ResetPassReq {
  email: string;
  otp: string;
  newPassword: string;
}

export interface EmailVerificationReq {
  email: string;
}

export interface VerifyEmailReq {
  email: string;
  otp: string;
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
    forgotPassword: builder.mutation<ForgotPassRes, ForgotPassReq>({
      query: (body) => ({
        url: forgotPassEP,
        method: "POST",
        body,
      }),
    }),
    resetPassword: builder.mutation<ResetPassRes, ResetPassReq>({
      query: (body) => ({
        url: resetPassEP,
        method: "POST",
        body,
      }),
    }),
    sendEmailVerification: builder.mutation<
      ForgotPassRes,
      EmailVerificationReq
    >({
      query: (body) => ({
        url: sendEmailVerificationEP,
        method: "POST",
        body,
      }),
    }),
    verifyEmail: builder.mutation<ResetPassRes, VerifyEmailReq>({
      query: (body) => ({
        url: verifyEmailEP,
        method: "POST",
        body,
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
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useSendEmailVerificationMutation,
  useVerifyEmailMutation,
} = authApi;
