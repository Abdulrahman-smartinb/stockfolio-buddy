import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { useResolvedRole } from "./useResolveRole";
import { useGetInvestorShareTradeRequestsQuery } from "@/store/api/shares/shareTradeRequestApi";
import { useGetInvestorPortfolioQuery } from "@/store/api/investorApi";
import { useGetShareTransactionsQuery } from "@/store/api/shares/shareTransactionsApi";
import { useUploadReceiptMutation } from "@/store/api/stocksApi";
import { PendingRequestItem } from "@/interfaces/Stocks";
import { toast } from "./use-toast";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import countries from "@/data/countries.json";
import { useRequestPaymentUrlMutation } from "@/store/api/paymentApi";
import { compressImage } from "@/lib/utils";

const useInvestorActivity = () => {
  const { resolvedRole } = useResolvedRole();
  const { t } = useTranslation();
  const profileId = resolvedRole?.profileId;
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);

  const user = JSON.parse(Cookies.get("profile")) || {};

  // Trade Requests
  const tradeRequestsQuery = useGetInvestorShareTradeRequestsQuery(
    { id: profileId },
    { skip: !profileId },
  );

  // Portfolio / Shares
  const portfolioQuery = useGetInvestorPortfolioQuery(
    { id: profileId },
    { skip: !profileId },
  );

  // Share Transactions
  const transactionsQuery = useGetShareTransactionsQuery(
    {
      holderId: profileId,
      limit: 10,
      sort: "-createdAt",
    },
    { skip: !profileId },
  );

  // Normalized Data
  const tradeRequests = tradeRequestsQuery.data?.data ?? [];

  const portfolioSummary = portfolioQuery.data?.data?.summary ?? {
    totalValue: 0,
    totalInvested: 0,
    pnl: 0,
    realizedPnL: 0,
  };

  const portfolioAssets = portfolioQuery.data?.data?.assets ?? [];

  const shareTransactions = transactionsQuery.data?.data ?? [];

  // Derived Helpers
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
    if (!file) {
      toast({
        title: t("toast.file_req"),
        variant: "destructive",
        description: t("toast.pls_upload_file"),
        duration: 5000,
      });
      return;
    }
    if (!selectedPaymentMethod) {
      toast({
        title: t("toast.payment_method_req"),
        variant: "destructive",
        description: t("toast.pls_select_payment_method"),
        duration: 5000,
      });
      return;
    }
    const isPDF = file.type === "application/pdf";
    const isImage = file.type.startsWith("image/");
    if (!isPDF && !isImage) {
      toast({
        title: t("toast.unsupported_file"),
        variant: "destructive",
        description: t("toast.supported_files_pdf_img"),
        duration: 5000,
      });
      return;
    }

    try {
      let finalFile = file;

      if (file.type.startsWith("image/")) {
        finalFile = await compressImage(file);
      }

      const formData = new FormData();
      formData.append("paymentConfirmationDocument", finalFile);
      formData.append("paymentMethodId", selectedPaymentMethod._id);

      await uploadReceipt({ id: request._id, formData }).unwrap();
      toast({ title: t("toast.file_uploaded"), variant: "default" });
      tradeRequestsQuery.refetch();
      setSelectedPaymentMethod(null);
      setSelectedRequest(null);
    } catch (err) {
      console.error("Upload failed", err);
      if (err?.data?.message === "File too large") {
        toast({
          title: t("toast.file_too_large"),
          variant: "default",
          description: t("toast.file_too_large_desc"),
          duration: 5000,
        });
      } else {
        toast({
          title: t("toast.error_while_uploading"),
          variant: "default",
          description: err?.data?.message || err?.message,
          duration: 5000,
        });
      }
    }
  };

  useEffect(() => {
    if (
      selectedPaymentMethod &&
      selectedRequest &&
      selectedPaymentMethod?.method !== "onlinePayment"
    ) {
      document.getElementById("real-upload-input")?.click();
    }
  }, [selectedPaymentMethod]);

  const [requestUrl, { isLoading: loadingPayment }] =
    useRequestPaymentUrlMutation();

  useEffect(() => {
    if (loadingPayment) {
      toast({
        title: t("common.redirect_warn"),
        variant: "default",
      });
    }
  }, [loadingPayment]);

  const submitPayment = async (method) => {
    setSelectedPaymentMethod(method);

    if (method?.method === "onlinePayment") {
      const curr = method?.onlinePayment?.acceptCurrency;
      const token = method?.onlinePayment?.xJadwaToken;

      if (!curr || !token) {
        console.error("Missing currency or token");
        toast({
          title: t("toast.missing_configuration"),
          variant: "destructive",
          description: t("toast.missing_conf_contact_admin"),
          duration: 5000,
        });
        return;
      }

      const { numberOfShares, pricePerShare, _id: orderId } = selectedRequest;
      const { email, phone, address, city, state, zipCode, countryCode } = user;

      const country = countries.find((c) => c.code === countryCode);

      const paymentData = {
        quantity: numberOfShares,
        totalAmount: numberOfShares * pricePerShare,
        email,
        firstName: user.fullName,
        lastName: user.slug,
        phoneNumber: phone,
        address,
        city,
        state,
        countryName: country.name,
        countryCode,
        zipCode,
        gatewayName: method?.onlinePayment?.gatewayName,
        jadwaOrderId: orderId,
      };

      try {
        const res = await requestUrl({
          data: paymentData,
          curr,
          token,
        }).unwrap();

        window.open(res?.data?.redirectUrl, "_self");
      } catch (error) {
        console.error("payment request failed:", error);
      }
    } else {
      setIsPaymentModalOpen(false);
    }
  };

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
    isPaymentModalOpen,
    setIsPaymentModalOpen,
    selectedRequest,
    setSelectedRequest,
    selectedPaymentMethod,
    setSelectedPaymentMethod,
    submitPayment,
  };
};

export default useInvestorActivity;
