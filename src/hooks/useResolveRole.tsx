// src/hooks/useResolvedRole.ts
import { useMemo } from "react";
import { useResolveRoleQuery } from "@/store/api/authApi";
import Cookies from "js-cookie";

export const useResolvedRole = () => {
  const profile = useMemo(() => {
    try {
      return JSON.parse(Cookies.get("profile") || "{}");
    } catch {
      return {};
    }
  }, []);

  const authUserId = profile?.authUserId;
  const { data, isLoading, error, refetch, isFetching } = useResolveRoleQuery(
    { authUserId },
    { skip: !authUserId },
  );

  const resolved = useMemo(() => {
    if (!data) return null;

    return {
      role: data.role, // "investor" | "applicant"
      profileId: data.profileId,
      reviewStatus: data.reviewStatus,
      isInvestor: data.role === "investor",
      isApplicant: data.role === "applicant",
    };
  }, [data]);

  return {
    resolvedRole: resolved,
    loadingRole: isLoading,
    fetchingRole: isFetching,
    roleError: error,
    refetchRole: refetch,
  };
};
