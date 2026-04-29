import { motion } from "framer-motion";
import {
  Search,
  RefreshCw,
  LayoutGrid,
  BriefcaseBusiness,
  Filter,
  FilterX,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { BuyModal } from "@/components/BuyModal";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import useDashboard from "@/hooks/useDashboard";
import { CheckVerificationModal } from "@/components/CheckVerificationModal";
import { VerifyAccountModal } from "@/components/VerifyAccountModal";
import { useProfile } from "@/hooks/useProfile";
import StocksList from "@/components/Dashboard/StocksList";
import ProjectsList from "@/components/Dashboard/ProjectsList";
import CompaniesList from "@/components/Dashboard/CompaniesList";
import {
  DashboardOverview,
  LatestTransactions,
} from "@/components/Dashboard/DashboardOverview";
import { cn } from "@/lib/utils";
import { VerifyAccountTermsModal } from "@/components/VerifyAccountTermsModal";
import { useLocation, useNavigate } from "react-router-dom";
import ProjectsFilters from "@/components/ProjectsFilters";
import { useEffect } from "react";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    t,
    lang,
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

    isBuyModalOpen,
    setIsBuyModalOpen,
    verfiyModalOpen,
    verifyModalMode,
    setVerfiyModalOpen,
    tradeType,

    stocks,
    companies,
    projects,

    isStocksLoading,
    isProjectsLoading,
    isFetching,

    refetchStocks,
    refetchProjects,

    handleStockClick,
    portfolio,
    portfolioLoading,
    latestTransactions,
    transactions,
    transactionsLoading,
    categories,
    tags,
    showFilters,
    setShowFilters,
  } = useDashboard();

  const {
    user,
    openVerify,
    setOpenVerify,
    handleSubmit,
    handleClose,
    isSubmitting,
    idPhoto,
    setIdPhoto,
    idPhotoBack,
    setIdPhotoBack,
    livePhoto,
    setLivePhoto,
    livePhotoPreview,
    setLivePhotoPreview,
    idNumber,
    setIdNumber,
    passportNumber,
    setPassportNumber,
    passportExpDate,
    setPassportExpDate,
    email,
    setEmail,
    openInstructions,
    setOpenInstructions,
    idPhotoPreview,
    setIdPhotoPreview,
    idPhotoBackPreview,
    setIdPhotoBackPreview,
    passportImage,
    setPassportImage,
    setPassportPreview,
    passportPreview,
    disableSubmit,
    setDisableSubmit,
  } = useProfile();

  useEffect(() => {
    if (typeof location.state?.restoreScrollY !== "number") return;

    requestAnimationFrame(() => {
      window.scrollTo({ top: location.state.restoreScrollY, behavior: "auto" });
    });

    navigate(location.pathname, { replace: true, state: {} });
  }, [location.pathname, location.state, navigate]);

  const handleRefresh = () => {
    if (activeTab === "projects") {
      refetchProjects();
    } else {
      refetchStocks();
    }
  };

  return (
    <div className="min-h-screen home-bg" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto space-y-4 p-3 pb-[120px] sm:p-4 md:space-y-5 md:px-6 lg:px-8 xl:max-w-8xl">
        <DashboardOverview
          t={t}
          portfolio={portfolio}
          loading={portfolioLoading}
          transactions={transactions}
          activeFundsCount={stocks.length}
        />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-4 space-y-3 md:mb-6 md:space-y-4"
        >
          {/* Tabs */}
          <div className="flex w-full items-center overflow-x-auto rounded-full border bg-card p-1 scrollbar-hidden sm:inline-flex sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveTab("funds")}
              className={cn(
                "h-10 flex-1 rounded-full px-3 text-xs font-medium transition flex items-center justify-center gap-1.5 whitespace-nowrap sm:flex-none sm:px-4 sm:text-sm sm:gap-2",
                activeTab === "funds"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <BriefcaseBusiness className="w-4 h-4" />
              {t("nav.funds_tab")}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("projects")}
              className={cn(
                "h-10 flex-1 rounded-full px-3 text-xs font-medium transition flex items-center justify-center gap-1.5 whitespace-nowrap sm:flex-none sm:px-4 sm:text-sm sm:gap-2",
                activeTab === "projects"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <LayoutGrid className="w-4 h-4" />
              {t("nav.projects_tab")}
            </button>

            <button
              type="button"
              onClick={() => setActiveTab("companies")}
              className={cn(
                "h-10 flex-1 rounded-full px-3 text-xs font-medium transition flex items-center justify-center gap-1.5 whitespace-nowrap sm:flex-none sm:px-4 sm:text-sm sm:gap-2",
                activeTab === "companies"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <BriefcaseBusiness className="w-4 h-4" />
              {t("nav.companies_tab")}
            </button>
          </div>

          {/* Search + Refresh */}
          <div className="flex flex-wrap items-center gap-2 md:flex-nowrap md:gap-4">
            <div className="relative min-w-0 flex-1 md:max-w-lg lg:max-w-xl">
              <Search
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-5 h-5 jadwa-icon-gold",
                  isRtl ? "right-4" : "left-4",
                )}
              />

              <Input
                type="text"
                placeholder={
                  activeTab === "funds"
                    ? t("home.search_placeholder")
                    : activeTab === "companies"
                      ? t("companies.search_placeholder")
                      : t("investment.search_placeholder")
                }
                value={
                  activeTab === "projects"
                    ? projectSearchQuery
                    : stockSearchQuery
                }
                onChange={(e) =>
                  activeTab === "projects"
                    ? setProjectSearchQuery(e.target.value)
                    : setStockSearchQuery(e.target.value)
                }
                className={cn(
                  "h-11 bg-card text-xs rounded-[999px] md:h-12",
                  isRtl ? "pr-12 pl-4" : "pl-12 pr-4",
                )}
              />
            </div>

            <Button
              disabled={isFetching}
              onClick={handleRefresh}
              className="h-11 w-11 rounded-full shrink-0 md:h-12 md:w-32"
            >
              <motion.div
                animate={isFetching ? "spin" : "stop"}
                variants={{
                  spin: {
                    rotate: 360,
                    transition: {
                      repeat: Infinity,
                      duration: 0.9,
                      ease: "linear",
                    },
                  },
                  stop: { rotate: 0 },
                }}
                className="flex items-center justify-center"
              >
                <RefreshCw className="w-5 h-5 md:hidden jadwa-icon-brown" />
              </motion.div>

              <motion.span
                animate={
                  isFetching ? { opacity: [0.6, 1, 0.6] } : { opacity: 1 }
                }
                transition={
                  isFetching ? { repeat: Infinity, duration: 1.1 } : {}
                }
                className="hidden md:inline"
              >
                {t("app.refresh")}
              </motion.span>
            </Button>

            {activeTab === "projects" && (
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="h-11 w-11 rounded-full shrink-0 md:h-12 md:w-32"
              >
                {showFilters ? (
                  <FilterX className="w-5 h-5 md:hidden jadwa-icon-brown" />
                ) : (
                  <Filter className="w-5 h-5 md:hidden jadwa-icon-brown" />
                )}
                <span className="hidden md:inline">
                  {showFilters
                    ? t("filters.hide_filters")
                    : t("filters.show_filters")}
                </span>
              </Button>
            )}
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-5 lg:gap-5">
          <div className="min-w-0 lg:col-span-3">
            {activeTab === "funds" ? (
              <StocksList
                stocks={stocks}
                isLoading={isStocksLoading}
                t={t}
                lang={lang}
                portfolioAssets={portfolio?.data?.assets || []}
                onAction={(stock, type) => handleStockClick(stock, type)}
              />
            ) : activeTab === "companies" ? (
              <CompaniesList
                companies={companies}
                isLoading={isStocksLoading}
                t={t}
                lang={lang}
              />
            ) : (
              <>
                {showFilters && (
                  <ProjectsFilters
                    t={t}
                    isRtl={isRtl}
                    projectSearchQuery={projectSearchQuery}
                    setProjectSearchQuery={setProjectSearchQuery}
                    selectedProjectCategory={selectedProjectCategory}
                    setSelectedProjectCategory={setSelectedProjectCategory}
                    selectedProjectTags={selectedProjectTags}
                    setSelectedProjectTags={setSelectedProjectTags}
                    categories={categories}
                    tags={tags}
                    onClear={clearProjectFilters}
                  />
                )}
                <ProjectsList
                  projects={projects}
                  isLoading={isProjectsLoading}
                  t={t}
                  lang={lang}
                  isRtl={isRtl}
                  onView={(project) =>
                    navigate(`/project-details/${project._id}`, {
                      state: {
                        from: location.pathname,
                        restoreScrollY: window.scrollY,
                      },
                    })
                  }
                />
              </>
            )}
          </div>

          <LatestTransactions
            t={t}
            transactions={latestTransactions}
            isLoading={transactionsLoading}
            className="lg:col-span-2"
          />
        </div>
      </main>

      <BuyModal
        stock={selectedStock}
        isOpen={isBuyModalOpen}
        tradType={tradeType}
        isRtl={isRtl}
        onClose={() => {
          setIsBuyModalOpen(false);
          setSelectedStock(null);
        }}
      />

      <CheckVerificationModal
        isOpen={verfiyModalOpen}
        onClose={() => setVerfiyModalOpen(false)}
        mode={verifyModalMode}
        onVerify={() => {
          setVerfiyModalOpen(false);
          setOpenInstructions(true);
        }}
      />

      <VerifyAccountModal
        isOpen={openVerify}
        onClose={handleClose}
        t={t}
        idNumber={idNumber}
        setIdNumber={setIdNumber}
        passportNumber={passportNumber}
        setPassportNumber={setPassportNumber}
        passportExpDate={passportExpDate}
        setPassportExpDate={setPassportExpDate}
        idPhoto={idPhoto}
        setIdPhoto={setIdPhoto}
        idPhotoBack={idPhotoBack}
        setIdPhotoBack={setIdPhotoBack}
        livePhoto={livePhoto}
        setLivePhoto={setLivePhoto}
        livePhotoPreview={livePhotoPreview}
        setLivePhotoPreview={setLivePhotoPreview}
        passportImage={passportImage}
        setPassportImage={setPassportImage}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        email={email}
        setEmail={setEmail}
        user={user}
        idPhotoPreview={idPhotoPreview}
        setIdPhotoPreview={setIdPhotoPreview}
        idPhotoBackPreview={idPhotoBackPreview}
        setIdPhotoBackPreview={setIdPhotoBackPreview}
        setPassportPreview={setPassportPreview}
        passportPreview={passportPreview}
        disableSubmit={disableSubmit}
        setDisableSubmit={setDisableSubmit}
      />

      <VerifyAccountTermsModal
        isOpen={openInstructions}
        onClose={() => setOpenInstructions(false)}
        onAccept={() => {
          setOpenVerify(true);
          setOpenInstructions(false);
        }}
      />

      <Footer />
    </div>
  );
};

export default Dashboard;
