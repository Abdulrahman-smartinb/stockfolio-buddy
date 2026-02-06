import React from "react";
import { Wallet, RefreshCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import useInvestorActivity from "@/hooks/useInvestorActivity";
import { useTranslation } from "react-i18next";

const PRIMARY = "#042623";

const MyShares = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { portfolioAssets, portfolioSummary, loading, refetch } =
    useInvestorActivity();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-5 space-y-4">
        {/* ===== Summary ===== */}
        <div
          className="rounded-2xl p-4 border shadow-sm"
          style={{
            borderColor: `${PRIMARY}1a`,
            background: `${PRIMARY}08`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground">
                {t("shares.summary.total_value")}
              </p>
              <p className="text-lg font-bold text-[#042623]">
                ${portfolioSummary.totalValue.toFixed(2)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-muted-foreground">
                {t("shares.summary.pnl")}
              </p>
              <p
                className={cn(
                  "text-lg font-bold",
                  portfolioSummary.pnl >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
                )}
              >
                {portfolioSummary.pnl >= 0 ? "+" : "-"}$
                {Math.abs(portfolioSummary.pnl).toFixed(2)}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Header ===== */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-semibold text-[#042623] flex items-center gap-2">
            <Wallet className="w-4 h-4" />
            {t("shares.title")}
          </h2>

          <button
            onClick={refetch.portfolio}
            className="h-8 w-8 rounded-lg flex items-center justify-center
              bg-[#042623]/5 text-[#042623]
              hover:bg-[#042623]/10 transition"
            aria-label={t("refresh")}
          >
            <RefreshCcw className="w-4 h-4" />
          </button>
        </div>

        {/* ===== List ===== */}
        {loading.portfolio ? (
          <Skeleton />
        ) : portfolioAssets.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-3">
            {portfolioAssets.map((asset) => {
              const pnlPositive = asset.pnl >= 0;

              const fundName = isRtl
                ? asset.fund?.nameAr || asset.fund?.fullLegalName
                : asset.fund?.fullLegalName;

              return (
                <div
                  key={asset.assetId}
                  className="rounded-xl p-4 border bg-white shadow-sm
                    active:bg-[#042623]/5 transition"
                  style={{ borderColor: `${PRIMARY}1a` }}
                >
                  {/* Top */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold text-[#042623] truncate">
                        {fundName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {asset.shares} {t("shares.shares")} · {t("shares.avg")}{" "}
                        ${asset.avgPrice}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-semibold text-[#042623]">
                        ${asset.value.toFixed(2)}
                      </p>
                      <p
                        className={cn(
                          "text-xs font-medium",
                          pnlPositive ? "text-emerald-600" : "text-rose-600"
                        )}
                      >
                        {pnlPositive ? "+" : "-"}$
                        {Math.abs(asset.pnl).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Bottom */}
                  <div className="mt-3 flex justify-between text-xs text-muted-foreground">
                    <span>
                      {t("shares.current")} ${asset.currentPrice}
                    </span>
                    <span>
                      {t("shares.invested")} ${asset.invested}
                    </span>
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

export default MyShares;

/* ===== Helpers ===== */

const Skeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div key={i} className="h-24 rounded-xl bg-[#042623]/10 animate-pulse" />
    ))}
  </div>
);

const Empty = () => (
  <div className="text-center text-sm text-muted-foreground py-10">
    {/* i18n */}
    You don’t own any shares yet
  </div>
);
