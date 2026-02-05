// src/hooks/useResolvedRole.ts
import { useMemo } from "react";
import { useResolveRoleQuery } from "@/store/api/authApi";

export const useResolvedRole = () => {
  const profile = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("profile") || "{}");
    } catch {
      return {};
    }
  }, []);

  const authUserId = profile?.authUserId;
  const { data, isLoading, error } = useResolveRoleQuery(
    { authUserId },
    { skip: !authUserId }
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
    roleError: error,
  };
};
