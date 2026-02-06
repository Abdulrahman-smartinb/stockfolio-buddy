import React from "react";
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

const PRIMARY = "#042623";

const MyTransactions = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { shareTransactions, loading, refetch } = useInvestorActivity();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-5 space-y-4">
        {/* ===== Summary ===== */}
        <div
          className="rounded-2xl p-4 border shadow-sm"
          style={{ borderColor: `${PRIMARY}1a`, background: `${PRIMARY}08` }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground">
                {t("transactions.history")}
              </p>
              <p className="text-lg font-bold text-[#042623]">
                {shareTransactions.length}
              </p>
            </div>

            <button
              onClick={refetch.transactions}
              className="
                h-8 w-8 rounded-lg
                flex items-center justify-center
                bg-[#042623]/5 text-[#042623]
                hover:bg-[#042623]/10 transition
              "
              aria-label={t("app.refresh")}
            >
              <RefreshCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* ===== Header ===== */}
        <div className="flex items-center gap-2 text-sm font-semibold text-[#042623]">
          <ListOrdered className="w-4 h-4" />
          {t("transactions.history")}
        </div>

        {/* ===== List ===== */}
        {loading.transactions ? (
          <Skeleton />
        ) : shareTransactions.length === 0 ? (
          <Empty text={t("activity.no_records")} />
        ) : (
          <div className="space-y-3">
            {shareTransactions.map((tx) => {
              const isBuy = tx.side === "buy";
              const total = tx.quantity * tx.pricePerShare;

              return (
                <div
                  key={tx._id}
                  className="
                    rounded-xl p-4 border bg-white shadow-sm
                    transition active:bg-[#042623]/5
                  "
                  style={{ borderColor: `${PRIMARY}1a` }}
                >
                  <div className="flex items-start justify-between gap-3">
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={cn(
                          "h-8 w-8 rounded-lg flex items-center justify-center",
                          isBuy
                            ? "bg-emerald-500/15 text-emerald-700"
                            : "bg-rose-500/15 text-rose-700"
                        )}
                      >
                        {isBuy ? (
                          <ArrowDownLeft className="w-4 h-4" />
                        ) : (
                          <ArrowUpRight className="w-4 h-4" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#042623] truncate">
                          {t(`activity.${isBuy ? "buy" : "sell"}`)} ·{" "}
                          {tx.quantity} {t("activity.shares")}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {t("shares.price_per_share")} · ${tx.pricePerShare}
                        </p>
                      </div>
                    </div>

                    {/* Right */}
                    <div className="text-right shrink-0">
                      <p className="text-sm font-semibold text-[#042623] tabular-nums">
                        ${total.toFixed(2)}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
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
