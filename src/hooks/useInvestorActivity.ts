import { useMemo } from "react";
import { useResolvedRole } from "./useResolveRole";
import { useGetInvestorShareTradeRequestsQuery } from "@/store/api/shares/shareTradeRequestApi";
import { useGetInvestorPortfolioQuery } from "@/store/api/investorApi";
import { useGetShareTransactionsQuery } from "@/store/api/shares/shareTransactionsApi";

const useInvestorActivity = () => {
  const { resolvedRole } = useResolvedRole();
  const profileId = resolvedRole?.profileId;

  /* ================= Trade Requests ================= */

  const tradeRequestsQuery = useGetInvestorShareTradeRequestsQuery(
    { id: profileId },
    { skip: !profileId }
  );

  /* ================= Portfolio / Shares ================= */

  const portfolioQuery = useGetInvestorPortfolioQuery(
    { id: profileId },
    { skip: !profileId }
  );

  /* ================= Share Transactions ================= */

  const transactionsQuery = useGetShareTransactionsQuery(
    {
      holderId: profileId,
      limit: 10,
      sort: "-createdAt",
    },
    { skip: !profileId }
  );

  /* ================= Normalized Data ================= */

  const tradeRequests = tradeRequestsQuery.data?.data ?? [];

  const portfolioSummary = portfolioQuery.data?.data?.summary ?? {
    totalValue: 0,
    totalInvested: 0,
    pnl: 0,
    realizedPnL: 0,
  };

  const portfolioAssets = portfolioQuery.data?.data?.assets ?? [];

  const shareTransactions = transactionsQuery.data?.data ?? [];

  /* ================= Derived Helpers ================= */

  // Mobile previews (max 2 items each)
  const preview = useMemo(() => {
    return {
      tradeRequests: tradeRequests.slice(0, 2),
      assets: portfolioAssets.slice(0, 2),
      transactions: shareTransactions.slice(0, 2),
    };
  }, [tradeRequests, portfolioAssets, shareTransactions]);

  const isLoading =
    tradeRequestsQuery.isLoading ||
    portfolioQuery.isLoading ||
    transactionsQuery.isLoading;

  const hasError =
    tradeRequestsQuery.error || portfolioQuery.error || transactionsQuery.error;

  const refetchAll = () => {
    tradeRequestsQuery.refetch();
    portfolioQuery.refetch();
    transactionsQuery.refetch();
  };

  /* ================= Public API ================= */

  return {
    profileId,

    // raw
    tradeRequests,
    portfolioSummary,
    portfolioAssets,
    shareTransactions,

    // previews (mobile-first)
    preview,

    // states
    isLoading,
    hasError,

    // granular loading (optional for skeletons)
    loading: {
      tradeRequests: tradeRequestsQuery.isLoading,
      portfolio: portfolioQuery.isLoading,
      transactions: transactionsQuery.isLoading,
    },

    // actions
    refetchAll,
    refetch: {
      tradeRequests: tradeRequestsQuery.refetch,
      portfolio: portfolioQuery.refetch,
      transactions: transactionsQuery.refetch,
    },
  };
};

export default useInvestorActivity;
