import { motion } from "framer-motion";
import { Search, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { BuyModal } from "@/components/BuyModal";
import { Button } from "@/components/ui/button";
import { Footer } from "@/components/Footer";
import useDashboard from "@/hooks/useDashboard";
import { CheckVerificationModal } from "@/components/CheckVerificationModal";
import { VerifyAccountModal } from "@/components/VerifyAccountModal";
import { useProfile } from "@/hooks/useProfile";
import InvestmentsSlider from "@/components/Dashboard/InvestmentsSlider";
import StocksList from "@/components/Dashboard/StocksList";

const Dashboard = () => {
  const {
    t,
    lang,
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
  } = useDashboard();

  const {
    openVerify,
    setOpenVerify,

    handleSubmit,
    handleClose,

    isSubmitting,

    // verify inputs
    idPhoto,
    setIdPhoto,
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
  } = useProfile();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto p-4 ">
        <InvestmentsSlider
          t={t}
          isRtl={isRtl}
          portfolio={portfolio}
          loading={portfolioLoading}
        />
        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center justify-between">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground " />
              <Input
                type="text"
                placeholder={t("home.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 h-12 bg-card text-xs rounded-[999px]"
              />
            </div>

            <Button
              disabled={isLoading}
              className="h-12 w-12 md:w-32 ms-2 rounded-[999px] background-pr"
              onClick={refetch}
            >
              {/* Mobile: Icon */}
              {!isLoading && <RefreshCw className="w-5 h-5 md:hidden" />}

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
        <StocksList
          stocks={stocks}
          isLoading={isLoading}
          t={t}
          lang={lang}
          onAction={(stock, type) => handleStockClick(stock, type)}
        />
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
        onVerify={() => {
          setVerfiyModalOpen(false);
          setOpenVerify(true);
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
        livePhoto={livePhoto}
        setLivePhoto={setLivePhoto}
        livePhotoPreview={livePhotoPreview}
        setLivePhotoPreview={setLivePhotoPreview}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        email={email}
        setEmail={setEmail}
      />
      <Footer />
    </div>
  );
};

export default Dashboard;
