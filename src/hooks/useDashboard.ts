import { InvestmentEntity } from "@/interfaces/InvestmentEntity";
import { useGetInvestmentEntitiesQuery } from "@/store/api/investmentEntityApi";
import { Activity, BarChart3, DollarSign, TrendingUp } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { isInvestor } from "./helpers";
import { useResolvedRole } from "./useResolveRole";
import { useGetInvestorPortfolioQuery } from "@/store/api/investorApi";

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

  const { resolvedRole, loadingRole } = useResolvedRole();

  const {
    data: stocks = [],
    isLoading,
    error,
    refetch,
  } = useGetInvestmentEntitiesQuery({
    keyword: searchQuery,
  });

  const {
    data,

    error: err,
  } = useGetInvestorPortfolioQuery({
    id: resolvedRole?.profileId,
  });
  console.log(data);
  console.log(err);
  const handleStockClick = (stock: InvestmentEntity, type: string) => {
    if (resolvedRole.isApplicant) {
      setVerfiyModalOpen(true);
      return;
    }
    setSelectedStock(stock);
    setTradeType(type);
    setIsBuyModalOpen(true);
  };

  const stats = [
    {
      label: "market_status",
      value: t("open"),
      icon: Activity,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "top_gainer",
      value: "+2.58%",
      subValue: "NVDA",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "total_volume",
      value: "324.5M",
      icon: BarChart3,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "portfolio_value",
      value: "$12,450",
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return {
    t,
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
    stats,
  };
};
export default useDashboard;
