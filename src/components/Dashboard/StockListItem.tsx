import { motion } from "framer-motion";
import { ArrowUpRight, Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { base_url } from "@/api/GlobalData";
import { formatCurrency, formatNumber } from "@/hooks/helpers";
import { useLocation, useNavigate } from "react-router-dom";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";

const makeMiniData = (stock: any, portfolioAsset: any) => {
  const points =
    stock?.monthlyValues ||
    stock?.valueTimeline ||
    portfolioAsset?.monthlyValues ||
    portfolioAsset?.timeline ||
    [];

  if (Array.isArray(points) && points.length) {
    return points.map((point: any) => ({
      label: point.month || point.label || "",
      value: Number(point.value ?? point.total ?? 0),
    }));
  }

  const base = Number(
    portfolioAsset?.value ||
      portfolioAsset?.invested ||
      stock?.sharePrice ||
      stock?.currentPrice ||
      stock?.price ||
      1,
  );

  return [0.72, 0.82, 0.78, 0.96, 0.9, 1.06, 1].map((factor, index) => ({
    label: String(index + 1),
    value: Math.max(0, base * factor),
  }));
};

const StockListItem = ({
  t,
  lang,
  stock,
  index = 0,
  onAction,
  featured = false,
  portfolioAsset,
}) => {
  const name = stock?.name || stock?.fullLegalName || "-";
  const symbol = stock?.symbol || stock?.code || "";
  const price =
    portfolioAsset?.currentPrice ??
    stock?.price ??
    stock?.currentPrice ??
    stock?.sharePrice;
  const navigate = useNavigate();
  const location = useLocation();
  const chartData = makeMiniData(stock, portfolioAsset);
  const gradientId = `fundChart-${stock?._id || index}`;

  const openFundDetails = () => {
    navigate(`/fund-details/${stock?._id}`, {
      state: {
        from: location.pathname,
        restoreScrollY: window.scrollY,
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.25) }}
      className={cn(
        "group border border-border/60 bg-white/90 shadow-sm backdrop-blur-xl transition-all hover:shadow-md",
        featured
          ? "rounded-3xl p-3.5 sm:p-4 md:px-5"
          : "rounded-2xl p-3 sm:rounded-3xl sm:p-4",
      )}
    >
      <div
        className={cn(
          "grid gap-2.5 sm:gap-4",
          featured
            ? "md:grid-cols-[minmax(230px,0.9fr)_minmax(220px,1fr)_auto]"
            : "grid-rows-[auto_58px_auto] sm:grid-rows-[auto_120px_auto]",
        )}
      >
        <div className="flex min-w-0 items-center gap-3">
          <div
            className={cn(
              featured ? "h-12 w-12 sm:h-16 sm:w-16" : "h-10 w-10 sm:h-12 sm:w-12",
              "flex shrink-0 items-center justify-center overflow-hidden rounded-xl bg-muted/30 ring-1 ring-border/60 sm:rounded-2xl",
            )}
          >
            {stock?.logo ? (
              <img
                src={`${base_url}/InvestmentFunds/${stock.logo}`}
                alt={name}
                className="h-full w-full object-cover"
              />
            ) : (
              <Building2 className="h-5 w-5 text-muted-foreground" />
            )}
          </div>

          <div className="min-w-0">
            {symbol && (
              <p
                className="cursor-pointer truncate text-sm font-bold tracking-normal text-[#05332e] sm:text-lg md:text-xl font-google"
                onClick={openFundDetails}
              >
                {symbol}
              </p>
            )}

            <p
              className="cursor-pointer truncate text-xs font-semibold text-muted-foreground sm:text-sm md:text-base"
              onClick={openFundDetails}
            >
              {lang === "ar" && stock?.nameAr ? stock.nameAr : name}
            </p>

            <p className="mt-0.5 text-[11px] text-muted-foreground sm:mt-1 sm:text-xs">
              {t("portfolio.shares")}:{" "}
              {formatNumber(portfolioAsset?.shares ?? 0)}
            </p>
          </div>
        </div>

        <div
          className={cn(
            "min-h-[58px] sm:min-h-[112px]",
            featured && "min-h-[78px] sm:min-h-[112px] md:min-h-[124px]",
          )}
        >
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 0, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#b9a779" stopOpacity={0.75} />
                  <stop offset="95%" stopColor="#b9a779" stopOpacity={0.04} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" hide />
              <Tooltip
                contentStyle={{
                  border: "0",
                  borderRadius: 12,
                  boxShadow: "0 12px 30px rgba(5, 51, 46, 0.14)",
                }}
                formatter={(value: number) => [formatCurrency(value), "Value"]}
              />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#05332e"
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div
          className={cn(
            "flex shrink-0 gap-3",
            featured
              ? "items-center justify-between md:flex-col md:items-end md:justify-center"
              : "items-center justify-between",
          )}
        >
          <div className={cn(featured && "md:text-right")}>
            <p className="text-[11px] text-muted-foreground sm:text-xs">
              {t("portfolio.current_price")}
            </p>
            <p
              className="text-base font-bold tracking-normal text-[#05332e] font-google sm:text-xl"
              dir="ltr"
            >
              {price != null ? formatCurrency(price) : "-"}
            </p>
          </div>

          <button
            onClick={() => onAction?.("buy", stock)}
            className={cn(
              "group inline-flex items-center justify-center rounded-full bg-[#05332e] text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-[1px] hover:shadow-md active:translate-y-0 active:scale-[0.98]",
              featured ? "h-9 px-4 sm:h-10 sm:px-5" : "h-8 px-3 text-xs sm:h-9 sm:px-4 sm:text-sm",
            )}
          >
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-[1px] group-hover:-translate-y-[1px] sm:h-4 sm:w-4" />
            <span>{t("shares.buy")}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StockListItem;
