import { InvestmentEntity } from "@/interfaces/InvestmentEntity";
import { useGetInvestmentEntitiesQuery } from "@/store/api/investmentEntityApi";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useResolvedRole } from "./useResolveRole";
import { useGetInvestorPortfolioQuery } from "@/store/api/investorApi";
import {
  useGetInvestmentProjectFiltersQuery,
  useGetInvestmentProjectsQuery,
} from "@/store/api/investmentProjectsApi";
import { InvestmentProject } from "@/interfaces/investmentProject";
import { Option } from "@/components/ProjectsFilters";

type VerificationMode = "draft" | "pending";
type DashboardTab = "funds" | "projects" | "companies";
const DASHBOARD_STATE_KEY = "dashboardState";

const getStoredDashboardState = () => {
  if (typeof window === "undefined") return null;

  try {
    const raw = sessionStorage.getItem(DASHBOARD_STATE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const useDashboard = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const storedState = getStoredDashboardState();

  const [activeTab, setActiveTab] = useState<DashboardTab>(
    storedState?.activeTab || "funds",
  );
  const [stockSearchQuery, setStockSearchQuery] = useState(
    storedState?.stockSearchQuery || "",
  );
  const [projectSearchQuery, setProjectSearchQuery] = useState(
    storedState?.projectSearchQuery || "",
  );

  // projects-only filters
  const [selectedProjectCategory, setSelectedProjectCategory] = useState(
    storedState?.selectedProjectCategory || "",
  );
  const [selectedProjectTags, setSelectedProjectTags] = useState<Option[]>(
    storedState?.selectedProjectTags || [],
  );
  const selectedProjectTagIds = selectedProjectTags.map((tag) => tag._id);

  const [selectedStock, setSelectedStock] = useState<InvestmentEntity | null>(
    null,
  );
  const [selectedProject, setSelectedProject] =
    useState<InvestmentProject | null>(null);

  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);
  const [verfiyModalOpen, setVerfiyModalOpen] = useState(false);
  const [tradeType, setTradeType] = useState("");
  const [verifyModalMode, setVerifyModalMode] =
    useState<VerificationMode>("draft");
  const [showFilters, setShowFilters] = useState(!!storedState?.showFilters);

  const { resolvedRole, refetchRole } = useResolvedRole();

  const {
    data: entities = [],
    isLoading: isStocksLoading,
    refetch: refetchStocks,
    isFetching: isFetchingEntities,
  } = useGetInvestmentEntitiesQuery({
    keyword: stockSearchQuery,
  });

  const { data: projectFiltersResponse, isLoading: isProjectFiltersLoading } =
    useGetInvestmentProjectFiltersQuery({
      status: "published",
    });

  const categories = projectFiltersResponse?.data?.categories || [];
  const tags = projectFiltersResponse?.data?.tags || [];

  const {
    data: projectsResponse,
    isLoading: isProjectsLoading,
    refetch: refetchProjects,
    isFetching: isFetchingProjects,
  } = useGetInvestmentProjectsQuery({
    keyword: projectSearchQuery,
    category: selectedProjectCategory || undefined,
    tags: selectedProjectTagIds,
  });

  const projects = projectsResponse || [];
  const funds = entities.filter((item) => item.entityType === "InvestmentFund");
  const companies = entities.filter(
    (item) => item.entityType === "ClientCompany",
  );

  useEffect(() => {
    if (typeof window === "undefined") return;

    sessionStorage.setItem(
      DASHBOARD_STATE_KEY,
      JSON.stringify({
        activeTab,
        stockSearchQuery,
        projectSearchQuery,
        selectedProjectCategory,
        selectedProjectTags,
        showFilters,
      }),
    );
  }, [
    activeTab,
    stockSearchQuery,
    projectSearchQuery,
    selectedProjectCategory,
    selectedProjectTags,
    showFilters,
  ]);

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

  const clearProjectFilters = () => {
    setProjectSearchQuery("");
    setSelectedProjectCategory("");
    setSelectedProjectTags([]);
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

    selectedProjectCategory,
    setSelectedProjectCategory,
    selectedProjectTags,
    setSelectedProjectTags,
    clearProjectFilters,

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

    stocks: funds,
    companies,
    projects,

    isStocksLoading,
    isProjectsLoading,
    isFetching: isFetchingEntities || isFetchingProjects,

    refetchStocks,
    refetchProjects,

    handleStockClick,

    portfolio,
    portfolioLoading,
    categories,
    tags,
    isProjectFiltersLoading,
    showFilters,
    setShowFilters,
  };
};

export default useDashboard;
