import { motion } from "framer-motion";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { StockCard } from "@/components/StockCard";
import { BuyModal } from "@/components/BuyModal";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import useDashboard from "@/hooks/useDashboard";
import { CheckVerificationModal } from "@/components/CheckVerificationModal";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const {
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
  } = useDashboard();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-xl md:text-4xl font-bold text-foreground mb-2">
            {t("markets_overview")}
          </h1>
          <p className="text-muted-foreground text-sm md:text-xl">
            {t("home_letter")}
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">
                    {t(stat.label)}
                  </p>
                  <p className={`text-lg font-bold ${stat.color}`}>
                    {stat.value}
                  </p>
                  {stat.subValue && (
                    <p className="text-xs text-muted-foreground">
                      {stat.subValue}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between space-x-4">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground " />
              <Input
                type="text"
                placeholder={t("search")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card text-xs"
              />
            </div>

            <Button
              disabled={isLoading}
              className="h-12 w-12 md:w-32 shrink-0 flex items-center justify-center gap-2"
              onClick={refetch}
            >
              {/* Mobile: Icon */}
              <RefreshCw className="w-5 h-5 md:hidden" />

              {/* Desktop: Text */}
              <span className="hidden md:inline">{t("refresh")}</span>

              {isLoading && (
                <span className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      ease: "linear",
                    }}
                    className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full"
                  />
                </span>
              )}
            </Button>
          </div>
        </motion.div>

        {/* Stocks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-muted shimmer" />
                    <div>
                      <div className="h-4 w-16 bg-muted rounded shimmer mb-2" />
                      <div className="h-3 w-24 bg-muted rounded shimmer" />
                    </div>
                  </div>
                </div>
                <div className="h-8 w-24 bg-muted rounded shimmer mb-2" />
                <div className="h-4 w-16 bg-muted rounded shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {stocks?.map((stock, index) => (
              <StockCard
                key={stock._id}
                stock={stock}
                onAction={(type) => handleStockClick(stock, type)}
                index={index}
              />
            ))}
          </div>
        )}

        {!isLoading && stocks?.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {t("no_records_found")}
            </h3>
            <p className="text-muted-foreground">{t("adjust_query")}</p>
          </motion.div>
        )}
      </main>

      <BuyModal
        stock={selectedStock}
        isOpen={isBuyModalOpen}
        tradType={tradeType}
        onClose={() => {
          setIsBuyModalOpen(false);
          setSelectedStock(null);
        }}
      />

      <CheckVerificationModal
        isOpen={verfiyModalOpen}
        onClose={() => setVerfiyModalOpen(false)}
        onVerify={() => {
          setVerfiyModalOpen(false);
          navigate("/profile");
        }}
      />
      <Footer />
    </div>
  );
};

export default Dashboard;
