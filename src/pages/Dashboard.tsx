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
import { cn } from "@/lib/utils";
import { VerifyAccountTermsModal } from "@/components/VerifyAccountTermsModal";

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
    verifyModalMode,
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
  } = useProfile();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      {/* MAIN */}
      <main className="container mx-auto p-4 md:px-6 lg:px-8 xl:max-w-8xl">
        {/* Portfolio Slider */}
        <InvestmentsSlider
          t={t}
          isRtl={isRtl}
          portfolio={portfolio}
          loading={portfolioLoading}
        />

        {/* Search + Refresh */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="flex items-center gap-3 md:gap-4">
            {/* Search */}
            <div className="relative w-full max-w-md md:max-w-lg lg:max-w-xl">
              <Search
                className={cn(
                  "absolute top-1/2 -translate-y-1/2 w-5 h-5 jadwa-icon-gold",
                  isRtl ? "right-4" : "left-4",
                )}
              />

              <Input
                type="text"
                placeholder={t("home.search_placeholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "h-12 bg-card text-xs rounded-[999px]",
                  isRtl ? "pr-12 pl-4" : "pl-12 pr-4",
                )}
              />
            </div>

            {/* Refresh */}
            <Button
              disabled={isLoading}
              onClick={refetch}
              className="h-12 w-12 md:w-32 rounded-full shrink-0"
            >
              {/* Mobile */}
              {!isLoading && (
                <RefreshCw className="w-5 h-5 md:hidden jadwa-icon-brown" />
              )}

              {/* Desktop */}
              <span className="hidden md:inline">{t("app.refresh")}</span>

              {isLoading && (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    repeat: Infinity,
                    duration: 1,
                    ease: "linear",
                  }}
                  className="
                    w-4 h-4
                    border-2
                    border-success-foreground/30
                    border-t-success-foreground
                    rounded-full
                  "
                />
              )}
            </Button>
          </div>
        </motion.div>

        {/* Stocks */}
        <StocksList
          stocks={stocks}
          isLoading={isLoading}
          t={t}
          lang={lang}
          onAction={(stock, type) => handleStockClick(stock, type)}
        />
      </main>

      {/* Modals */}
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
