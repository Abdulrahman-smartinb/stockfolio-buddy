import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { base_url } from "@/api/GlobalData";
import { RingLoader } from "react-spinners";
import { useEffect, useMemo, useState } from "react";
import { formatCurrency, formatNumber } from "@/hooks/helpers";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  ChevronRight,
  RefreshCcw,
  Wallet,
  ListOrdered,
  ArrowDownLeft,
  ArrowUpRight,
  Building2,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import { useResolvedRole } from "@/hooks/useResolveRole";
import { useGetFundTransactionsQuery } from "@/store/api/shares/shareTransactionsApi";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import useFundDetails from "@/hooks/useFundDetails";

const PRIMARY = "#042623";

const normalizeDisplayName = (item, lang, fallbacks = []) => {
  if (!item) return null;
  if (typeof item === "string") return item;

  const candidates =
    lang === "ar"
      ? [
          item.nameAr,
          item.tradeName,
          item.fullLegalName,
          item.name,
          ...fallbacks,
        ]
      : [
          item.fullLegalName,
          item.name,
          item.tradeName,
          item.nameAr,
          ...fallbacks,
        ];

  return (
    candidates.find((value) => typeof value === "string" && value.trim()) ||
    null
  );
};

const MyFundTransactions = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { resolvedRole } = useResolvedRole();
  const { fund, isLoading } = useFundDetails("1M");

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const profileId = resolvedRole?.profileId;
  const selectedAsset = location.state?.asset;
  const fromPath = location.state?.from || "/Activity/MyShares";

  useEffect(() => {
    setPage(1);
  }, [location.pathname, profileId]);

  const {
    data: fundTransactionsResponse,
    isLoading: transactionsLoading,
    isFetching: transactionsFetching,
    refetch: refetchTransactions,
  } = useGetFundTransactionsQuery(
    {
      page,
      limit,
      sort: "-createdAt",
      assetType: "InvestmentFund",
      assetId: fund?._id,
      holderId: profileId,
    },
    {
      skip: !fund?._id || !profileId,
    },
  );

  const fundDisplayName = normalizeDisplayName(fund, i18n.language, [
    fund?.code,
  ]);
  const pagination = fundTransactionsResponse?.pagination;
  const fundTransactions = fundTransactionsResponse?.data ?? [];
  const totalPages = Math.max(pagination?.totalPages ?? 1, 1);
  const totalTransactionCount =
    pagination?.totalItems ?? fundTransactions.length;

  const visiblePages = useMemo(() => {
    const pages = [];
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, start + 4);

    for (let pageNumber = start; pageNumber <= end; pageNumber += 1) {
      pages.push(pageNumber);
    }

    return pages;
  }, [page, totalPages]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <RingLoader />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8 space-y-6">
        <button
          type="button"
          onClick={() => navigate(fromPath)}
          className="inline-flex items-center gap-2 text-sm font-medium text-[#042623] transition hover:opacity-75"
        >
          {i18n.language === "ar" ? (
            <ChevronRight className="h-4 w-4 jadwa-icon-gold" />
          ) : (
            <ChevronLeft className="h-4 w-4 jadwa-icon-gold" />
          )}
          {t("common.back")}
        </button>

        <section
          className="rounded-3xl border bg-white p-5 shadow-sm md:p-6"
          style={{ borderColor: `${PRIMARY}1a` }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="flex min-w-0 items-center gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#042623]/5 ring-1 ring-[#042623]/10">
                {fund?.logo ? (
                  <img
                    src={`${base_url}/InvestmentFunds/${fund.logo}`}
                    alt={fundDisplayName || fund?.code}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Building2 className="h-6 w-6 jadwa-icon-gold" />
                )}
              </div>

              <div className="min-w-0">
                <h1 className="truncate text-xl font-bold text-[#042623]">
                  {fundDisplayName}
                </h1>
                <p className="mt-1 text-sm text-jadwa-muted">
                  {fund?.code || t("app.unknown_asset")}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                navigate(`/fund-details/${fund?._id}`, {
                  state: {
                    from: location.pathname,
                    restoreScrollY: window.scrollY,
                  },
                })
              }
              className="inline-flex items-center rounded-xl border border-[#042623]/10 bg-[#042623]/5 px-4 py-2 text-sm font-medium text-[#042623] transition hover:bg-[#042623]/10"
            >
              {t("fund.overview")}
            </button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            <SummaryCard
              icon={<Wallet className="h-4 w-4 jadwa-icon-gold" />}
              label={t("fund.your_shares")}
              value={
                selectedAsset?.shares != null
                  ? formatNumber(selectedAsset.shares)
                  : "—"
              }
            />
            <SummaryCard
              label={t("shares.avg")}
              value={
                selectedAsset?.avgPrice != null
                  ? formatCurrency(selectedAsset.avgPrice)
                  : "—"
              }
            />
            <SummaryCard
              label={t("shares.invested")}
              value={
                selectedAsset?.invested != null
                  ? formatCurrency(selectedAsset.invested)
                  : "—"
              }
            />
            <SummaryCard
              label={t("portfolio.total_value")}
              value={
                selectedAsset?.value != null
                  ? formatCurrency(selectedAsset.value)
                  : "—"
              }
            />
            <SummaryCard
              label={t("shares.summary.pnl")}
              value={
                selectedAsset?.pnl != null
                  ? `${selectedAsset.pnl >= 0 ? "+" : "-"}${formatCurrency(
                      Math.abs(selectedAsset.pnl),
                    )}`
                  : "—"
              }
              valueClassName={
                selectedAsset?.pnl == null
                  ? undefined
                  : selectedAsset.pnl >= 0
                    ? "text-emerald-600"
                    : "text-rose-600"
              }
            />
          </div>
        </section>

        <section
          className="rounded-3xl border bg-white p-4 shadow-sm md:p-6"
          style={{ borderColor: `${PRIMARY}1a` }}
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-semibold text-[#042623]">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#042623]/5">
                  <ListOrdered className="h-5 w-5 jadwa-icon-gold" />
                </span>
                {t("fund.my_transactions")}
              </h2>
              <p className="mt-1 text-sm text-jadwa-muted">
                {fundDisplayName} • {formatNumber(totalTransactionCount)}{" "}
                {t("fund.transaction_count")}
              </p>
            </div>

            <button
              type="button"
              onClick={() => refetchTransactions()}
              className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#042623]/5 text-[#042623] transition hover:bg-[#042623]/10"
              aria-label={t("app.refresh")}
            >
              <RefreshCcw className="h-5 w-5 jadwa-icon-gold" />
            </button>
          </div>

          <div className="mt-5">
            {transactionsLoading ? (
              <TransactionsSkeleton />
            ) : fundTransactions.length === 0 ? (
              <EmptyState label={t("fund.no_transactions_for_fund")} />
            ) : (
              <div className="space-y-3">
                {fundTransactions.map((tx) => {
                  const isBuy = tx.side === "buy";
                  const total = tx.quantity * tx.pricePerShare;

                  return (
                    <div
                      key={tx._id}
                      className="rounded-2xl border bg-background/80 p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-3">
                          <div
                            className={cn(
                              "flex h-10 w-10 items-center justify-center rounded-xl",
                              isBuy
                                ? "bg-emerald-500/15 text-emerald-700"
                                : "bg-rose-500/15 text-rose-700",
                            )}
                          >
                            {isBuy ? (
                              <ArrowDownLeft className="h-5 w-5 jadwa-icon-gold" />
                            ) : (
                              <ArrowUpRight className="h-5 w-5 jadwa-icon-gold" />
                            )}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-[#042623] md:text-base">
                              {t(`activity.${isBuy ? "buy" : "sell"}`)} •{" "}
                              <span className="font-google tabular-nums">
                                {formatNumber(tx.quantity)}
                              </span>{" "}
                              {t("activity.shares")}
                            </p>
                            <p className="text-xs text-jadwa-muted md:text-sm">
                              {t("shares.price_per_share")} •{" "}
                              <span className="font-google tabular-nums">
                                {formatCurrency(tx.pricePerShare)}
                              </span>
                            </p>
                          </div>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="font-semibold text-[#042623] font-google tabular-nums">
                            {formatCurrency(total)}
                          </p>
                          <p className="text-xs text-jadwa-muted md:text-sm">
                            {new Date(tx.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <div className="mt-5 flex flex-col gap-4 border-t border-border/50 pt-5 md:flex-row md:items-center md:justify-between">
            <Pagination className="mx-0 w-full justify-start md:w-auto">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className={cn(
                      (page <= 1 || transactionsFetching) &&
                        "pointer-events-none opacity-50",
                    )}
                    onClick={(event) => {
                      event.preventDefault();
                      if (page > 1 && !transactionsFetching) {
                        setPage((currentPage) => currentPage - 1);
                      }
                    }}
                  />
                </PaginationItem>

                {visiblePages.map((pageNumber) => (
                  <PaginationItem key={pageNumber}>
                    <PaginationLink
                      href="#"
                      isActive={pageNumber === page}
                      onClick={(event) => {
                        event.preventDefault();
                        if (!transactionsFetching) {
                          setPage(pageNumber);
                        }
                      }}
                    >
                      {pageNumber}
                    </PaginationLink>
                  </PaginationItem>
                ))}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className={cn(
                      (page >= totalPages || transactionsFetching) &&
                        "pointer-events-none opacity-50",
                    )}
                    onClick={(event) => {
                      event.preventDefault();
                      if (page < totalPages && !transactionsFetching) {
                        setPage((currentPage) => currentPage + 1);
                      }
                    }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>

            <div className="flex items-center justify-between gap-3 text-sm text-jadwa-muted md:justify-end">
              <span>
                {t("fund.pagination_summary", {
                  page,
                  totalPages,
                  totalItems: totalTransactionCount,
                })}
              </span>

              <label className="flex items-center gap-2">
                <span>{t("transactions.rows_per_page")}</span>
                <select
                  value={limit}
                  onChange={(event) => {
                    setLimit(Number(event.target.value));
                    setPage(1);
                  }}
                  className="rounded-lg border border-border/60 bg-background/60 px-3 py-1.5 text-sm font-medium text-foreground"
                >
                  {[5, 10, 20, 50].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

const SummaryCard = ({ icon = null, label = null, value = null, valueClassName = null }) => (
  <div
    className="rounded-2xl border bg-white p-4 shadow-sm"
    style={{ borderColor: `${PRIMARY}1a` }}
  >
    <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-jadwa-muted">
      {icon ? <span>{icon}</span> : null}
      <span>{label}</span>
    </div>
    <p
      className={cn(
        "mt-3 text-lg font-semibold text-[#042623] font-google tabular-nums",
        valueClassName,
      )}
    >
      {value}
    </p>
  </div>
);

const EmptyState = ({ label }) => (
  <div className="rounded-2xl border border-dashed border-border/60 bg-card/60 px-4 py-6 text-center text-sm text-muted-foreground">
    {label}
  </div>
);

const TransactionsSkeleton = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((item) => (
      <div
        key={item}
        className="h-20 animate-pulse rounded-2xl bg-[#042623]/10"
      />
    ))}
  </div>
);

export default MyFundTransactions;
