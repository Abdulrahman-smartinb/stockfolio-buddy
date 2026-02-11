import React from "react";
import { RefreshCcw, Wallet, ListOrdered, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import useInvestorActivity from "@/hooks/useInvestorActivity";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { formatCurrency, formatNumber } from "@/hooks/helpers";

/* ================= Page ================= */

const InvestorActivity = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { preview, isLoading, refetchAll } = useInvestorActivity();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 md:px-6 py-5 md:py-8 space-y-4 md:space-y-6">
        {/* My Shares */}
        <SectionCard
          title={t("activity.my_shares")}
          icon={<Wallet className="w-4 h-4 md:w-5 md:h-5" />}
          onRefresh={refetchAll}
          onNavigate={() => navigate("/Activity/MyShares")}
          isLoading={isLoading}
          empty={!preview?.assets?.length}
        >
          {preview.assets.slice(0, 2).map((asset) => (
            <Row key={asset.assetId}>
              <div className="min-w-0">
                <p className="truncate text-sm md:text-lg font-medium md:font-semibold text-[#042623]">
                  {isRtl ? asset?.fund?.nameAr : asset.fund?.fullLegalName}
                </p>
                <p className="text-[11px] md:text-sm text-muted-foreground">
                  <span className="font-google mx-1">
                    {formatNumber(asset.shares)}
                  </span>
                  {t("activity.shares")}
                </p>
              </div>

              <Amount>{formatCurrency(asset.value)}</Amount>
            </Row>
          ))}
        </SectionCard>

        {/* Transactions */}
        <SectionCard
          title={t("activity.transactions")}
          icon={<ListOrdered className="w-4 h-4 md:w-5 md:h-5" />}
          onRefresh={refetchAll}
          onNavigate={() => navigate("/Activity/MyTransactions")}
          isLoading={isLoading}
          empty={!preview?.transactions?.length}
        >
          {preview.transactions.slice(0, 2).map((tx) => (
            <Row key={tx._id}>
              <div className="min-w-0">
                <p className="truncate text-sm md:text-lg font-medium md:font-semibold text-[#042623]">
                  {tx.side === "buy" ? t("activity.buy") : t("activity.sell")} ·{" "}
                  {tx.quantity} {t("activity.shares")}
                </p>
                <p className="text-[11px] md:text-sm text-muted-foreground font-google">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Amount>{formatCurrency(tx.pricePerShare)}</Amount>
            </Row>
          ))}
        </SectionCard>

        {/* Trade Requests */}
        <SectionCard
          title={t("activity.trade_requests")}
          icon={<Clock className="w-4 h-4 md:w-5 md:h-5" />}
          onRefresh={refetchAll}
          onNavigate={() => navigate("/Activity/MyTradeRequest")}
          isLoading={isLoading}
          empty={!preview?.tradeRequests?.length}
        >
          {preview.tradeRequests.slice(0, 2).map((req) => {
            const amount = req.numberOfShares * req.pricePerShare;

            return (
              <Row key={req._id}>
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate text-sm md:text-lg font-medium md:font-semibold text-[#042623]">
                    {t(`activity.${req.tradeType}`)} · {req.source.code}
                  </p>

                  <p className="text-[11px] md:text-sm text-muted-foreground font-google">
                    {formatNumber(req.numberOfShares)} ×{" "}
                    {formatCurrency(req.pricePerShare)}
                  </p>

                  <StatusBadge status={req.requestStatus} />
                </div>

                <Amount>{formatCurrency(amount)}</Amount>
              </Row>
            );
          })}
        </SectionCard>
      </main>

      <Footer />
    </div>
  );
};

export default InvestorActivity;

/* ================= UI ================= */

const SectionCard = ({
  title,
  icon,
  children,
  isLoading,
  empty,
  onRefresh,
  onNavigate,
}: any) => {
  return (
    <div className="rounded-2xl md:rounded-3xl bg-white border border-[#042623]/10 shadow-sm md:shadow-md">
      {/* Header */}
      <div
        onClick={onNavigate}
        role={onNavigate ? "button" : undefined}
        className={cn(
          "flex items-center justify-between p-4 md:p-6",
          onNavigate &&
            "cursor-pointer hover:bg-[#042623]/5 transition rounded-t-2xl md:rounded-t-3xl"
        )}
      >
        <div className="flex items-center gap-3">
          <span
            className="
            w-8 h-8 md:w-10 md:h-10
            rounded-lg md:rounded-xl
            bg-[#042623]/5 text-[#042623]
            flex items-center justify-center
          "
          >
            {icon}
          </span>

          <span className="text-sm md:text-lg font-semibold md:font-bold text-[#042623]">
            {title}
          </span>
        </div>

        {onRefresh && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRefresh();
            }}
            className="
              h-8 w-8 md:h-9 md:w-9
              rounded-lg md:rounded-xl
              flex items-center justify-center
              hover:bg-[#042623]/10
              transition
            "
          >
            <RefreshCcw className="w-4 h-4 md:w-5 md:h-5 text-[#042623]" />
          </button>
        )}
      </div>

      <div className="px-4 md:px-6 pb-4 md:pb-6">
        {isLoading ? (
          <Skeleton />
        ) : empty ? (
          <Empty />
        ) : (
          <div className="space-y-2 md:space-y-3">{children}</div>
        )}
      </div>
    </div>
  );
};

const Row = ({ children }: { children: React.ReactNode }) => (
  <div
    className="
    flex items-center justify-between
    rounded-xl md:rounded-2xl
    px-3 md:px-5
    py-2.5 md:py-4
    bg-[#042623]/5
    hover:bg-[#042623]/10
    transition
  "
  >
    {children}
  </div>
);

const Amount = ({ children }: { children: React.ReactNode }) => (
  <span
    className="
    text-sm md:text-xl
    font-semibold md:font-bold
    text-[#042623]
    tabular-nums font-google
  "
  >
    {children}
  </span>
);

const StatusBadge = ({ status }: { status: string }) => {
  const { t } = useTranslation();

  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600",
    approved: "bg-emerald-500/10 text-emerald-600",
    confirmed: "bg-emerald-500/10 text-emerald-600",
    rejected: "bg-rose-500/10 text-rose-600",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-[10px] md:text-xs font-semibold",
        styles[status] ?? "bg-muted text-muted-foreground"
      )}
    >
      {t(`transactions.${status}`)}
    </span>
  );
};

const Skeleton = () => (
  <div className="space-y-2 md:space-y-3">
    {[1, 2].map((i) => (
      <div
        key={i}
        className="h-10 md:h-14 rounded-xl md:rounded-2xl bg-[#042623]/10 animate-pulse"
      />
    ))}
  </div>
);

const Empty = () => (
  <div className="py-3 md:py-6 text-center text-[11px] md:text-sm text-[#042623]/60">
    No records yet
  </div>
);
