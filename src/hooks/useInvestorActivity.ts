import { ChangeEvent, useMemo } from "react";
import { useResolvedRole } from "./useResolveRole";
import { useGetInvestorShareTradeRequestsQuery } from "@/store/api/shares/shareTradeRequestApi";
import { useGetInvestorPortfolioQuery } from "@/store/api/investorApi";
import { useGetShareTransactionsQuery } from "@/store/api/shares/shareTransactionsApi";
import { useUploadReceiptMutation } from "@/store/api/stocksApi";
import { PendingRequestItem } from "@/interfaces/Stocks";
import { toast } from "./use-toast";
import { useTranslation } from "react-i18next";

const useInvestorActivity = () => {
  const { resolvedRole } = useResolvedRole();
  const { t } = useTranslation();
  const profileId = resolvedRole?.profileId;

  /* ================= Trade Requests ================= */

  const tradeRequestsQuery = useGetInvestorShareTradeRequestsQuery(
    { id: profileId },
    { skip: !profileId },
  );

  /* ================= Portfolio / Shares ================= */

  const portfolioQuery = useGetInvestorPortfolioQuery(
    { id: profileId },
    { skip: !profileId },
  );

  /* ================= Share Transactions ================= */

  const transactionsQuery = useGetShareTransactionsQuery(
    {
      holderId: profileId,
      limit: 10,
      sort: "-createdAt",
    },
    { skip: !profileId },
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

  const [uploadReceipt, { isLoading: isUploading, error }] =
    useUploadReceiptMutation();
  const handleFileChange = async (
    e: ChangeEvent<HTMLInputElement>,
    request: PendingRequestItem,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return; // Validate file type (Images or PDF)
    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPDF && !isImage) {
      toast({
        title: t("unsupported_file"),
        variant: "destructive",
        description: t("supported_files_pdf_img"),
      });
      return;
    } // Create FormData for the backend
    const formData = new FormData();
    formData.append("paymentConfirmationDocument", file);
    try {
      await uploadReceipt({ id: request._id, formData }).unwrap();
      toast({ title: t("file_uploaded"), variant: "default" });
      tradeRequestsQuery.refetch();
    } catch (err) {
      console.error("Upload failed", err);
      toast({
        title: t("error_while_uploading"),
        variant: "default",
        description: error?.data?.message || err.message,
      });
    }
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
    isUploading,
    // actions
    handleFileChange,
    refetchAll,
    refetch: {
      tradeRequests: tradeRequestsQuery.refetch,
      portfolio: portfolioQuery.refetch,
      transactions: transactionsQuery.refetch,
    },
  };
};

export default useInvestorActivity;
