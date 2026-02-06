import React from "react";
import {
  RefreshCcw,
  ChevronRight,
  ChevronLeft,
  Wallet,
  ListOrdered,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import useInvestorActivity from "@/hooks/useInvestorActivity";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

/* ================= Page ================= */

const InvestorActivity = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

  const { preview, isLoading, refetchAll } = useInvestorActivity();

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-5 space-y-4">
        {/* My Shares */}
        <SectionCard
          title={t("activity.my_shares")}
          icon={<Wallet className="w-4 h-4" />}
          onRefresh={refetchAll}
          onMore={() => navigate("/Activity/MyShares")}
          isLoading={isLoading}
          empty={!preview?.assets?.length}
          isRtl={isRtl}
        >
          {preview.assets.slice(0, 2).map((asset) => (
            <Row key={asset.assetId}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#042623]">
                  {isRtl ? asset?.fund?.nameAr : asset.fund?.fullLegalName}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {asset.shares} {t("activity.shares")}
                </p>
              </div>

              <Amount>${asset.value}</Amount>
            </Row>
          ))}
        </SectionCard>

        {/* Transactions */}
        <SectionCard
          title={t("activity.transactions")}
          icon={<ListOrdered className="w-4 h-4" />}
          onRefresh={refetchAll}
          onMore={() => navigate("/Activity/MyTransactions")}
          isLoading={isLoading}
          empty={!preview?.transactions?.length}
          isRtl={isRtl}
        >
          {preview.transactions.slice(0, 2).map((tx) => (
            <Row key={tx._id}>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-[#042623]">
                  {tx.side === "buy" ? t("activity.buy") : t("activity.sell")} ·{" "}
                  {tx.quantity} {t("activity.shares")}
                </p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(tx.createdAt).toLocaleDateString()}
                </p>
              </div>

              <Amount>${tx.pricePerShare}</Amount>
            </Row>
          ))}
        </SectionCard>

        {/* Trade Requests */}
        <SectionCard
          title={t("activity.trade_requests")}
          icon={<Clock className="w-4 h-4" />}
          onRefresh={refetchAll}
          onMore={() => navigate("/Activity/MyTradeRequest")}
          isLoading={isLoading}
          empty={!preview?.tradeRequests?.length}
          isRtl={isRtl}
        >
          {preview.tradeRequests.slice(0, 2).map((req) => {
            const amount = req.numberOfShares * req.pricePerShare;

            return (
              <Row key={req._id}>
                <div className="min-w-0 space-y-0.5">
                  <p className="truncate text-sm font-medium text-[#042623]">
                    {t(`activity.${req.tradeType}`)} · {req.source.code}
                  </p>

                  <p className="text-[11px] text-muted-foreground">
                    {req.numberOfShares} × ${req.pricePerShare}
                  </p>

                  <StatusBadge status={req.requestStatus} />
                </div>

                <Amount>${amount}</Amount>
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
  onMore,
  isRtl,
}: any) => {
  return (
    <div className="rounded-2xl bg-white border border-[#042623]/10 shadow-sm p-4 space-y-3">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-[#042623]/5 text-[#042623] flex items-center justify-center">
            {icon}
          </span>
          <span className="text-sm font-semibold text-[#042623]">{title}</span>
        </div>

        <div className="flex items-center gap-1">
          {onRefresh && (
            <IconButton onClick={onRefresh}>
              <RefreshCcw className="w-4 h-4" />
            </IconButton>
          )}

          {onMore && (
            <IconButton onClick={onMore}>
              {isRtl ? (
                <ChevronLeft className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </IconButton>
          )}
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <Skeleton />
      ) : empty ? (
        <Empty />
      ) : (
        <div className="space-y-2">{children}</div>
      )}
    </div>
  );
};

const Row = ({ children }: { children: React.ReactNode }) => (
  <div className="flex items-center justify-between rounded-xl px-3 py-2.5 bg-[#042623]/5 hover:bg-[#042623]/10 transition">
    {children}
  </div>
);

const Amount = ({ children }: { children: React.ReactNode }) => (
  <span className="text-sm font-semibold text-[#042623] tabular-nums">
    {children}
  </span>
);

const StatusBadge = ({ status }: { status: string }) => {
  const styles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-600",
    approved: "bg-emerald-500/10 text-emerald-600",
    rejected: "bg-rose-500/10 text-rose-600",
    confirmed: "bg-emerald-500/10 text-emerald-600",
  };

  return (
    <span
      className={cn(
        "inline-block px-2 py-0.5 rounded-md text-[10px] font-medium",
        styles[status]
      )}
    >
      {status}
    </span>
  );
};

const IconButton = ({ children, onClick }: any) => (
  <button
    onClick={onClick}
    className="h-8 w-8 rounded-lg flex items-center justify-center
      bg-[#042623]/5 text-[#042623]
      hover:bg-[#042623]/10 transition"
  >
    {children}
  </button>
);

const Skeleton = () => (
  <div className="space-y-2">
    {[1, 2].map((i) => (
      <div key={i} className="h-9 rounded-xl bg-[#042623]/10 animate-pulse" />
    ))}
  </div>
);

const Empty = () => (
  <div className="py-3 text-center text-[11px] text-[#042623]/60">
    No records yet
  </div>
);
