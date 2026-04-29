import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  BriefcaseBusiness,
  Coins,
  Landmark,
  Package,
  TrendingUp,
} from "lucide-react";
import { formatCurrency, formatNumber } from "@/hooks/helpers";
import { cn } from "@/lib/utils";
import { AddCart } from "../../assets/icons/AddCart";
import { MinusCart } from "../../assets/icons/MinusCart";

const CHART_STROKE = "#b9a779";
const DARK = "#05332e";

const monthLabel = (date: Date) =>
  date.toLocaleDateString(undefined, { month: "short" });

const getPortfolioChartData = (portfolio: any, transactions: any[] = []) => {
  const provided =
    portfolio?.data?.monthlyValues ||
    portfolio?.data?.monthlyValue ||
    portfolio?.data?.valueTimeline ||
    portfolio?.data?.timeline ||
    portfolio?.monthlyValues ||
    [];

  if (Array.isArray(provided) && provided.length) {
    return provided.map((point: any) => ({
      month:
        point.month ||
        point.label ||
        (point.date ? monthLabel(new Date(point.date)) : ""),
      value: Number(point.value ?? point.totalValue ?? point.total ?? 0),
    }));
  }

  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - index));
    date.setDate(1);
    return {
      key: `${date.getFullYear()}-${date.getMonth()}`,
      month: monthLabel(date),
      value: 0,
    };
  });

  const totals = new Map(months.map((item) => [item.key, 0]));

  transactions.forEach((tx) => {
    const date = new Date(tx.createdAt);
    const key = `${date.getFullYear()}-${date.getMonth()}`;
    if (!totals.has(key)) return;

    const side = tx.side || tx.type;
    const amount =
      Number(tx.quantity ?? tx.shares ?? 0) *
      Number(tx.pricePerShare ?? tx.sharePrice ?? 0);

    totals.set(
      key,
      (totals.get(key) || 0) + (side === "sell" ? -amount : amount),
    );
  });

  let running = 0;
  return months.map((item) => {
    running += totals.get(item.key) || 0;
    return { month: item.month, value: running };
  });
};

export const DashboardOverview = ({
  t,
  portfolio,
  transactions,
  activeFundsCount,
}: any) => {
  const summary = portfolio?.data?.summary || {};
  const assets = portfolio?.data?.assets || [];
  const totalValue = Number(summary?.totalValue || 0);
  const totalInvested = Number(summary?.totalInvested || 0);
  const pnl = Number(summary?.pnl || totalValue - totalInvested || 0);
  const profitPositive = pnl >= 0;
  const chartData = getPortfolioChartData(portfolio, transactions);
  const displayedActiveFunds = activeFundsCount ?? assets.length;

  return (
    <section className="grid gap-3 sm:gap-4 lg:grid-cols-[minmax(0,0.94fr)_minmax(360px,1.06fr)]">
      <div className="flex flex-col gap-3 sm:gap-4 lg:justify-around">
        <div className="rounded-3xl bg-[#05332e] p-4 text-white shadow-lg sm:p-5 md:p-6">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm text-white/70">
                {t("portfolio.total_value")}
              </p>
              <p className="mt-2 break-words text-3xl font-bold tracking-normal sm:text-4xl md:mt-3 md:text-5xl font-google tabular-nums">
                {formatCurrency(totalValue)}
              </p>
            </div>

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:h-11 sm:w-11">
              <Landmark className="h-5 w-5 text-[#d8ca9e]" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-3">
          <StatCard
            icon={BriefcaseBusiness}
            label={t("fund.active_funds")}
            value={formatNumber(displayedActiveFunds, {
              maximumFractionDigits: 0,
            })}
          />
          <StatCard
            icon={TrendingUp}
            label={t("portfolio.pnl")}
            value={formatCurrency(pnl)}
            tone={profitPositive ? "positive" : "negative"}
          />
          <StatCard
            icon={Coins}
            label={t("fund.invested_amount")}
            value={formatCurrency(totalInvested)}
          />
        </div>
      </div>

      <div className="rounded-3xl bg-[#05332e] p-4 text-white shadow-lg sm:p-5 md:p-6">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs text-white/70 sm:text-sm">
              {t("fund.portfolio_performance")}
            </p>
            <p className="text-base font-semibold leading-snug text-white sm:text-xl">
              {t("fund.monthly_value")}
            </p>
          </div>
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl bg-white/10 sm:h-10 sm:w-10">
            <Package className="h-5 w-5 text-[#d8ca9e]" />
          </div>
        </div>

        <div className="h-[170px] sm:h-[220px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 10, right: 4, left: -18, bottom: 0 }}
            >
              <defs>
                <linearGradient id="dashboardValue" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor={CHART_STROKE}
                    stopOpacity={0.85}
                  />
                  <stop
                    offset="95%"
                    stopColor={CHART_STROKE}
                    stopOpacity={0.05}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255,255,255,0.1)" vertical={false} />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tick={{ fill: "rgba(255,255,255,0.72)", fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                width={46}
                tick={{ fill: "rgba(255,255,255,0.72)", fontSize: 12 }}
                tickFormatter={(value) =>
                  formatNumber(value, { notation: "compact" })
                }
              />
              <Tooltip
                cursor={{ stroke: "rgba(255,255,255,0.2)" }}
                contentStyle={{
                  background: "#ffffff",
                  border: "0",
                  borderRadius: 14,
                  color: DARK,
                }}
                formatter={(value: number) => [formatCurrency(value), "Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke={CHART_STROKE}
                strokeWidth={3}
                fill="url(#dashboardValue)"
                dot={false}
                activeDot={{ r: 5, fill: CHART_STROKE, stroke: "#fff" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </section>
  );
};

const StatCard = ({ icon: Icon, label, value, tone = "neutral" }: any) => (
  <div className="rounded-3xl bg-[#05332e] p-4 text-white shadow-lg ring-1 ring-white/10 md:p-6">
    <div className="flex items-start justify-between gap-2">
      <p className="text-xs leading-tight text-white/65 sm:text-sm md:text-base">
        {label}
      </p>
      <div className="mb-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/10 text-[#d8ca9e] sm:h-9 sm:w-9 md:mb-3">
        <Icon className="h-4 w-4" />
      </div>
    </div>
    <p
      className={cn(
        "mt-1 break-words text-base font-bold leading-tight font-google tabular-nums sm:text-lg",
        tone === "positive" && "text-emerald-200",
        tone === "negative" && "text-rose-200",
      )}
    >
      {value}
    </p>
  </div>
);

export const LatestTransactions = ({
  t,
  transactions = [],
  isLoading,
  className = "",
}: any) => {
  return (
    <aside
      className={cn(
        "rounded-3xl border border-border/70 bg-white p-4 shadow-sm lg:sticky lg:top-24 lg:self-start",
        className,
      )}
    >
      <div className="mb-3 flex items-center justify-between sm:mb-4">
        <h2 className="text-base font-bold text-[#05332e] sm:text-lg">
          {t("transactions.last_transactions")}
        </h2>
        <Package className="h-5 w-5 text-[#b9a779]" />
      </div>

      {isLoading ? (
        <div className="space-y-2.5 sm:space-y-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-16 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      ) : transactions.length ? (
        <div className="space-y-3">
          {transactions.map((tx: any) => {
            const side = tx.side || tx.type;
            const isBuy = side !== "sell";
            const total =
              Number(tx.purchaseValue) ||
              Number(tx.quantity ?? tx.shares ?? 0) *
                Number(tx.pricePerShare ?? tx.sharePrice ?? 0);

            return (
              <div
                key={tx._id}
                className="flex items-center justify-between gap-3 rounded-2xl bg-muted/40 p-3"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div
                    className={cn(
                      "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                      isBuy
                        ? "bg-[#9B8560]/15 text-emerald-700"
                        : "bg-rose-500/15 text-rose-700",
                    )}
                  >
                    {isBuy ? (
                      <AddCart className="h-7 w-7" />
                    ) : (
                      <MinusCart className="h-7 w-7" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#05332e]">
                      {t(`activity.${isBuy ? "buy" : "sell"}`)}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(tx.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="shrink-0 text-xs font-bold text-[#05332e] font-google tabular-nums sm:text-sm">
                  {formatCurrency(total)}
                </p>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="rounded-2xl bg-muted/40 p-6 text-center text-sm text-muted-foreground">
          {t("activity.no_records")}
        </div>
      )}
    </aside>
  );
};
