import { InvestmentEntity } from "@/interfaces/InvestmentEntity";
import { useGetInvestmentEntitiesQuery } from "@/store/api/investmentEntityApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useResolvedRole } from "./useResolveRole";
import { useGetInvestorPortfolioQuery } from "@/store/api/investorApi";
type VerificationMode = "draft" | "pending";

const useDashboard = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<InvestmentEntity | null>(
    null
  );
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [verfiyModalOpen, setVerfiyModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState("");
  const [verifyModalMode, setVerifyModalMode] =
    useState<VerificationMode>("draft");

  const { resolvedRole, refetchRole, loadingRole } = useResolvedRole();

  const {
    data: stocks = [],
    isLoading,
    refetch,
  } = useGetInvestmentEntitiesQuery({
    keyword: searchQuery,
  });

  const { data: portfolio, isLoading: portfolioLoading } =
    useGetInvestorPortfolioQuery({
      id: resolvedRole?.profileId,
    });

  const handleStockClick = async (stock: InvestmentEntity, type: string) => {
    const { data } = await refetchRole();
    if (!data) return;

    const { role, reviewStatus } = data;

    // If applicant → always block
    if (role === "applicant") {
      if (reviewStatus === "draft") {
        setVerifyModalMode("draft");
      } else if (reviewStatus === "pending") {
        setVerifyModalMode("pending");
      }

      setVerfiyModalOpen(true);
      return;
    }
    // Investor + approved → allow trade
    setSelectedStock(stock);
    setTradeType(type);
    setIsBuyModalOpen(true);
  };

  return {
    t,
    lang: i18n.language,
    isRtl,
    searchQuery,
    setSearchQuery,
    selectedStock,
    setSelectedStock,
    isBuyModalOpen,
    setIsBuyModalOpen,
    verfiyModalOpen,
    setVerfiyModalOpen,
    verifyModalMode,
    tradeType,
    stocks,
    isLoading,
    refetch,
    handleStockClick,
    portfolio,
    portfolioLoading,
  };
};
export default useDashboard;
