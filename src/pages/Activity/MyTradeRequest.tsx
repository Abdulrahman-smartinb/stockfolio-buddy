import React from "react";
import { Clock, RefreshCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import useInvestorActivity from "@/hooks/useInvestorActivity";
import { base_url } from "@/api/GlobalData";
import { useTranslation } from "react-i18next";
import { Empty, Skeleton, StatusBadge } from "@/components/helpers";
import { cn } from "@/lib/utils";

const PRIMARY = "#042623";

const MyTradeRequest = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { tradeRequests, loading, refetch } = useInvestorActivity();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-5 space-y-4">
        {/* ===== Header ===== */}
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold text-[#042623] flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {t("activity.trade_requests")}
          </h1>

          <button
            onClick={refetch.tradeRequests}
            aria-label={t("app.refresh")}
            className="
              h-8 w-8 rounded-lg flex items-center justify-center
              bg-[#042623]/5 text-[#042623]
              hover:bg-[#042623]/10 transition
            "
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* ===== List ===== */}
        {loading.tradeRequests ? (
          <Skeleton />
        ) : tradeRequests.length === 0 ? (
          <Empty text={t("activity.no_records")} />
        ) : (
          <div className="space-y-3">
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
                    rounded-xl border bg-white shadow-sm
                    p-4 space-y-2
                    active:bg-[#042623]/5 transition
                  "
                  style={{ borderColor: `${PRIMARY}1a` }}
                >
                  {/* Top */}
                  <div className="flex items-center gap-3">
                    {/* Logo */}
                    <div className="h-9 w-9 rounded-lg overflow-hidden bg-muted/30 shrink-0">
                      <img
                        src={`${base_url}/investmentFunds/${req.source.logo}`}
                        alt={fundName}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Name + type */}
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-[#042623] truncate">
                        {fundName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {t(`activity.${req.tradeType}`)}
                      </p>
                    </div>

                    <StatusBadge
                      status={req.requestStatus}
                      label={t(`transactions.${req.requestStatus}`)}
                    />
                  </div>

                  {/* Amount */}
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {req.numberOfShares} {t("activity.shares")} × $
                      {req.pricePerShare}
                    </span>

                    <span className="font-semibold text-[#042623] tabular-nums">
                      ${total.toLocaleString()}
                    </span>
                  </div>

                  {/* Date */}
                  <div className="text-[11px] text-muted-foreground">
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
