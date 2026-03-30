import { InvestmentEntity } from "@/interfaces/InvestmentEntity";
import { useGetInvestmentEntitiesQuery } from "@/store/api/investmentEntityApi";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useResolvedRole } from "./useResolveRole";
import { useGetInvestorPortfolioQuery } from "@/store/api/investorApi";
import { useGetInvestmentProjectsQuery } from "@/store/api/investmentProjectsApi";
import { InvestmentProject } from "@/interfaces/investmentProject";

type VerificationMode = "draft" | "pending";
type DashboardTab = "stocks" | "projects";

const useDashboard = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const [activeTab, setActiveTab] = useState<DashboardTab>("stocks");
  const [stockSearchQuery, setStockSearchQuery] = useState("");
  const [projectSearchQuery, setProjectSearchQuery] = useState("");

  const [selectedStock, setSelectedStock] = useState<InvestmentEntity | null>(
    null
  );
  const [selectedProject, setSelectedProject] =
    useState<InvestmentProject | null>(null);

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [verfiyModalOpen, setVerfiyModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState("");
  const [verifyModalMode, setVerifyModalMode] =
    useState<VerificationMode>("draft");

  const { resolvedRole, refetchRole } = useResolvedRole();

  const {
    data: stocks = [],
    isLoading: isStocksLoading,
    refetch: refetchStocks,
  } = useGetInvestmentEntitiesQuery({
    keyword: stockSearchQuery,
  });

  const {
    data: projects = [],
    isLoading: isProjectsLoading,
    refetch: refetchProjects,
  } = useGetInvestmentProjectsQuery({
    keyword: projectSearchQuery,
  });

  const { data: portfolio, isLoading: portfolioLoading } =
    useGetInvestorPortfolioQuery({
      id: resolvedRole?.profileId,
    });

  const handleStockClick = async (stock: InvestmentEntity, type: string) => {
    const { data } = await refetchRole();
    if (!data) return;

    const { role, reviewStatus } = data;

    if (role === "applicant") {
      if (reviewStatus === "draft") {
        setVerifyModalMode("draft");
      } else if (reviewStatus === "pending") {
        setVerifyModalMode("pending");
      }

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

    activeTab,
    setActiveTab,

    stockSearchQuery,
    setStockSearchQuery,
    projectSearchQuery,
    setProjectSearchQuery,

    selectedStock,
    setSelectedStock,
    selectedProject,
    setSelectedProject,

    isBuyModalOpen,
    setIsBuyModalOpen,
    verfiyModalOpen,
    setVerfiyModalOpen,
    verifyModalMode,
    tradeType,

    stocks,
    projects,

    isStocksLoading,
    isProjectsLoading,

    refetchStocks,
    refetchProjects,

    handleStockClick,

    portfolio,
    portfolioLoading,
  };
};

export default useDashboard;
