import React from "react";
import { Clock, RefreshCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import useInvestorActivity from "@/hooks/useInvestorActivity";
import { base_url } from "@/api/GlobalData";
import { useTranslation } from "react-i18next";
import { Empty, Skeleton, StatusBadge } from "@/components/helpers";
import { cn } from "@/lib/utils";
import { formatCurrency, formatNumber } from "@/hooks/helpers";

const PRIMARY = "#042623";

const MyTradeRequest = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { tradeRequests, loading, refetch } = useInvestorActivity();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-5 md:py-8 space-y-4 md:space-y-6">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between">
          <h1 className="text-sm md:text-lg font-semibold md:font-bold text-[#042623] flex items-center gap-3">
            <span
              className="
                w-8 h-8 md:w-10 md:h-10
                rounded-lg md:rounded-xl
                bg-[#042623]/5
                flex items-center justify-center
              "
            >
              <Clock className="w-4 h-4 md:w-5 md:h-5 text-[#042623]" />
            </span>

            {t("activity.trade_requests")}
          </h1>

          <button
            onClick={refetch.tradeRequests}
            aria-label={t("app.refresh")}
            className="
              h-8 w-8 md:h-9 md:w-9
              rounded-lg md:rounded-xl
              flex items-center justify-center
              bg-[#042623]/5 text-[#042623]
              hover:bg-[#042623]/10 transition
            "
          >
            <RefreshCcw className="w-4 h-4 md:w-5 md:h-5" />
          </button>
        </div>

        {/* ===== List ===== */}
        {loading.tradeRequests ? (
          <Skeleton />
        ) : tradeRequests.length === 0 ? (
          <Empty text={t("activity.no_records")} />
        ) : (
          <div className="space-y-3 md:space-y-4">
            {tradeRequests.map((req) => {
              const total =
                Number(req.numberOfShares) * Number(req.pricePerShare);

              const fundName =
                isRtl && req.source?.nameAr
                  ? req.source.nameAr
                  : req.source?.fullLegalName;

              return (
                <div
                  key={req._id}
                  className="
                    rounded-xl md:rounded-2xl
                    border bg-white
                    shadow-sm md:shadow-md
                    p-4 md:p-6
                    hover:shadow-lg
                    transition
                  "
                  style={{ borderColor: `${PRIMARY}1a` }}
                >
                  {/* ===== Top Row ===== */}
                  <div className="flex items-center gap-4">
                    {/* Logo */}
                    <div className="h-9 w-9 md:h-12 md:w-12 rounded-lg md:rounded-xl overflow-hidden bg-muted/30 shrink-0">
                      <img
                        src={`${base_url}/investmentFunds/${req.source.logo}`}
                        alt={fundName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name + Type */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm md:text-base font-semibold md:font-bold text-[#042623] truncate">
                        {fundName}
                      </p>

                      <p className="text-[11px] md:text-sm text-muted-foreground">
                        {t(`activity.${req.tradeType}`)}
                      </p>
                    </div>

                    {/* Status */}
                    <StatusBadge
                      status={req.requestStatus}
                      label={t(`transactions.${req.requestStatus}`)}
                    />
                  </div>

                  {/* ===== Amount Section ===== */}
                  <div className="mt-4 flex items-center justify-between text-xs md:text-sm">
                    <span className="text-muted-foreground  tabular-nums">
                      <span className="font-google">
                        {formatNumber(req.numberOfShares)}
                      </span>{" "}
                      {t("activity.shares")} ×{" "}
                      <span className="font-google">
                        {formatCurrency(req.pricePerShare)}
                      </span>{" "}
                    </span>

                    <span className="font-semibold md:font-bold text-[#042623] tabular-nums font-google text-lg md:text-xl">
                      {formatCurrency(total)}
                    </span>
                  </div>

                  {/* ===== Date ===== */}
                  <div className="mt-2 text-[11px] md:text-xs text-muted-foreground font-google">
                    {new Date(req.createdAt).toLocaleDateString()}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MyTradeRequest;
