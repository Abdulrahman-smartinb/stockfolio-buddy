import { InvestmentEntity } from "@/interfaces/InvestmentEntity";
import { useGetInvestmentEntitiesQuery } from "@/store/api/investmentEntityApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useResolvedRole } from "./useResolveRole";
import { useGetInvestorPortfolioQuery } from "@/store/api/investorApi";

const useDashboard = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<InvestmentEntity | null>(
    null,
  );
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [verfiyModalOpen, setVerfiyModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState("");

  const { resolvedRole } = useResolvedRole();

  const {
    data: stocks = [],
    isLoading,
    error,
    refetch,
  } = useGetInvestmentEntitiesQuery({
    keyword: searchQuery,
  });

  const {
    data: portfolio,
    isLoading: portfolioLoading,
    error: portfolioError,
  } = useGetInvestorPortfolioQuery({
    id: resolvedRole?.profileId,
  });

  const handleStockClick = (stock: InvestmentEntity, type: string) => {
    if (resolvedRole.isApplicant) {
      setVerfiyModalOpen(true);
      return;
    }
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
