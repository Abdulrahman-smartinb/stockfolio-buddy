import {
  ListOrdered,
  RefreshCcw,
  ArrowDownLeft,
  ArrowUpRight,
} from "lucide-react";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { cn } from "@/lib/utils";
import useInvestorActivity from "@/hooks/useInvestorActivity";
import { useTranslation } from "react-i18next";
import { Empty, Skeleton } from "@/components/helpers";
import { formatCurrency, formatNumber } from "@/hooks/helpers";

const PRIMARY = "#042623";

const MyTransactions = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { shareTransactions, loading, refetch } = useInvestorActivity();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-5 md:py-8 space-y-4 md:space-y-6">
        {/* ===== Summary ===== */}
        <div
          className="rounded-2xl md:rounded-3xl p-4 md:p-6 border shadow-sm md:shadow-md"
          style={{ borderColor: `${PRIMARY}1a`, background: `${PRIMARY}08` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs md:text-sm text-jadwa-muted">
                {t("transactions.history")}
              </p>
              <p className="text-lg md:text-2xl font-bold text-[#042623] font-google tabular-nums">
                {formatNumber(shareTransactions.length)}
              </p>
            </div>

            <button
              onClick={refetch.transactions}
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
        </div>

        {/* ===== Header ===== */}
        <div className="flex items-center gap-2 text-sm md:text-lg font-semibold md:font-bold text-[#042623]">
          <span
            className="
              w-8 h-8 md:w-10 md:h-10
              rounded-lg md:rounded-xl
              bg-[#042623]/5
              flex items-center justify-center
            "
          >
            <ListOrdered className="w-4 h-4 md:w-5 md:h-5 jadwa-icon-gold" />
          </span>
          {t("transactions.history")}
        </div>

        {/* ===== List ===== */}
        {loading.transactions ? (
          <Skeleton />
        ) : shareTransactions.length === 0 ? (
          <Empty text={t("activity.no_records")} />
        ) : (
          <div className="space-y-3 md:space-y-4">
            {shareTransactions.map((tx) => {
              const isBuy = tx.side === "buy";
              const total = tx.quantity * tx.pricePerShare;

              return (
                <div
                  key={tx._id}
                  className="
                    rounded-xl md:rounded-2xl
                    p-4 md:p-6
                    border bg-white shadow-sm md:shadow-md
                    hover:shadow-lg
                    transition
                  "
                  style={{ borderColor: `${PRIMARY}1a` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* ===== Left ===== */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "h-8 w-8 md:h-10 md:w-10 rounded-lg md:rounded-xl flex items-center justify-center",
                          isBuy
                            ? "bg-emerald-500/15 text-emerald-700"
                            : "bg-rose-500/15 text-rose-700",
                        )}
                      >
                        {isBuy ? (
                          <ArrowDownLeft className="w-4 h-4 md:w-5 md:h-5 jadwa-icon-gold" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4 md:w-5 md:h-5 jadwa-icon-gold" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm md:text-base font-semibold md:font-bold text-[#042623] truncate">
                          {t(`activity.${isBuy ? "buy" : "sell"}`)} ·{" "}
                          <span className="font-google tabular-nums">
                            {formatNumber(tx.quantity)}
                          </span>{" "}
                          {t("activity.shares")}
                        </p>

                        <p className="text-xs md:text-sm text-jadwa-muted">
                          {t("shares.price_per_share")} ·{" "}
                          <span className="font-google tabular-nums">
                            {formatCurrency(tx.pricePerShare)}
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* ===== Right ===== */}
                    <div className="text-right shrink-0">
                      <p className="text-sm md:text-base font-semibold md:font-bold text-[#042623] font-google tabular-nums">
                        {formatCurrency(total)}
                      </p>

                      <p className="text-xs md:text-sm text-jadwa-muted font-google tabular-nums">
                        {new Date(tx.createdAt).toLocaleDateString()}
                      </p>
                    </div>
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

export default MyTransactions;
