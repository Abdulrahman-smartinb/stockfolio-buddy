import { Wallet, RefreshCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import useInvestorActivity from "@/hooks/useInvestorActivity";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatNumber } from "@/hooks/helpers";
import { useLocation, useNavigate } from "react-router-dom";

const PRIMARY = "#042623";

const MyShares = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const navigate = useNavigate();
  const location = useLocation();

  const { portfolioAssets, portfolioSummary, loading, refetch } =
    useInvestorActivity();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-5 md:py-8 space-y-4 md:space-y-6">
        {/* ===== Summary ===== */}
        <div
          className="rounded-2xl md:rounded-3xl p-4 md:p-6 border shadow-sm md:shadow-md"
          style={{
            borderColor: `${PRIMARY}1a`,
            background: `${PRIMARY}08`,
          }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-jadwa-muted">
                {t("shares.summary.total_value")}
              </p>
              <p className="text-lg md:text-2xl font-bold text-[#042623] font-google tabular-nums">
                {formatCurrency(portfolioSummary.totalValue)}
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs md:text-sm text-jadwa-muted">
                {t("shares.summary.pnl")}
              </p>
              <p
                className={cn(
                  "text-lg md:text-2xl font-bold font-google tabular-nums",
                  portfolioSummary.pnl >= 0
                    ? "text-emerald-600"
                    : "text-rose-600",
                )}
              >
                {portfolioSummary.pnl >= 0 ? "+" : "-"}
                {formatCurrency(Math.abs(portfolioSummary.pnl))}
              </p>
            </div>
          </div>
        </div>

        {/* ===== Header ===== */}
        <div className="flex items-center justify-between">
          <h2 className="text-sm md:text-lg font-semibold md:font-bold text-[#042623] flex items-center gap-2">
            <span
              className="
              w-8 h-8 md:w-10 md:h-10
              rounded-lg md:rounded-xl
              bg-[#042623]/5
              flex items-center justify-center
            "
            >
              <Wallet className="w-4 h-4 md:w-5 md:h-5 jadwa-icon-gold" />
            </span>
            {t("shares.title")}
          </h2>

          <button
            onClick={refetch.portfolio}
            className="
              h-8 w-8 md:h-9 md:w-9
              rounded-lg md:rounded-xl
              flex items-center justify-center
              bg-[#042623]/5 text-[#042623]
              hover:bg-[#042623]/10 transition
            "
            aria-label={t("app.refresh")}
          >
            <RefreshCcw className="w-4 h-4 md:w-5 md:h-5 jadwa-icon-gold" />
          </button>
        </div>

        {/* ===== List ===== */}
        {loading.portfolio ? (
          <Skeleton />
        ) : portfolioAssets.length === 0 ? (
          <Empty />
        ) : (
          <div className="space-y-3 md:space-y-4">
            {portfolioAssets.map((asset) => {
              const pnlPositive = asset.pnl >= 0;
              const fundId = asset.fund?._id || asset.assetId;

              const fundName = isRtl
                ? asset.fund?.nameAr || asset.fund?.fullLegalName
                : asset.fund?.fullLegalName;
              const canNavigate = Boolean(fundId);

              return (
                <button
                  key={asset.assetId}
                  type="button"
                  disabled={!canNavigate}
                  onClick={() =>
                    canNavigate
                      ? navigate(`/Activity/MyShares/${fundId}`, {
                          state: {
                            asset,
                            from: location.pathname,
                            restoreScrollY: window.scrollY,
                          },
                        })
                      : undefined
                  }
                  className="
                    w-full text-left
                    rounded-xl md:rounded-2xl
                    p-4 md:p-6
                    border bg-white shadow-sm md:shadow-md
                    hover:shadow-lg
                    hover:-translate-y-0.5
                    disabled:cursor-default disabled:hover:translate-y-0
                    transition
                  "
                  style={{ borderColor: `${PRIMARY}1a` }}
                >
                  {/* ===== Top ===== */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-semibold md:font-bold text-[#042623] truncate text-sm md:text-base">
                        {fundName}
                      </p>

                      <p className="text-xs md:text-sm text-jadwa-muted">
                        <span className="font-google tabular-nums">
                          {formatNumber(asset.shares)}
                        </span>{" "}
                        {t("shares.shares")} · {t("shares.avg")}{" "}
                        <span className="font-google tabular-nums">
                          {formatCurrency(asset.avgPrice)}
                        </span>
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className="font-semibold md:font-bold text-[#042623] text-sm md:text-base font-google tabular-nums">
                        {formatCurrency(asset.value)}
                      </p>

                      <p
                        className={cn(
                          "text-xs md:text-sm font-semibold font-google tabular-nums",
                          pnlPositive ? "text-emerald-600" : "text-rose-600",
                        )}
                      >
                        {pnlPositive ? "+" : "-"}
                        {formatCurrency(Math.abs(asset.pnl))}
                      </p>
                    </div>
                  </div>

                  {/* ===== Bottom ===== */}
                  <div className="mt-3 md:mt-4 flex justify-between text-xs md:text-sm text-jadwa-muted">
                    <span>
                      {t("shares.current")}{" "}
                      <span className="font-google tabular-nums">
                        {formatCurrency(asset.currentPrice)}
                      </span>
                    </span>

                    <span>
                      {t("shares.invested")}{" "}
                      <span className="font-google tabular-nums">
                        {formatCurrency(asset.invested)}
                      </span>
                    </span>
                  </div>
                </button>
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
  <div className="space-y-3 md:space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-24 md:h-32 rounded-xl md:rounded-2xl bg-[#042623]/10 animate-pulse"
      />
    ))}
  </div>
);

const Empty = () => (
  <div className="text-center text-sm md:text-base text-jadwa-muted py-10 md:py-16">
    You don’t own any shares yet
  </div>
);
