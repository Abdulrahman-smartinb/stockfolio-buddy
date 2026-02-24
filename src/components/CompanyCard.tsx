import { base_url } from "@/api/GlobalData";
import { formatCompact, formatCurrency } from "@/hooks/helpers";
import { cn } from "@/lib/utils";
import Metric from "./Metric";

const CompanyCard = ({ row, t, isRtl }: any) => {
  const fund = row?.fund || {};
  const positive = Number(row?.pnl || 0) >= 0;

  const name = isRtl ? fund?.nameAr : fund?.fullLegalName || "—";
  const symbol = fund?.code || "";
  const logoUrl = fund?.logo
    ? `${base_url}/InvestmentFunds/${fund.logo}`
    : null;

  return (
    <div
      className={cn(
        "snap-start shrink-0 w-full sm:w-[400px]",
        "rounded-3xl p-6 text-muted shadow-lg",
        "bg-gradient-to-br from-[#072522] via-[#0a2f2c] to-[#0f3a36]",
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-2xl bg-muted/10 ring-1 ring-muted/10 overflow-hidden flex items-center justify-center shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm lg:text-base font-extrabold text-muted/80">
                {symbol.slice(0, 2)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-sm md:text-base lg:text-lg font-semibold text-muted truncate">
              {name} / {symbol}
            </p>

            <p className="text-xs md:text-sm lg:text-base text-muted/65 mt-1">
              {t("portfolio.shares")}:{" "}
              <span className="font-semibold text-muted">
                {formatCompact(row?.shares)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="my-5 h-px bg-muted/10" />

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3">
        <Metric label={t("portfolio.avg_price")} value={row?.avgPrice} />
        <Metric
          label={t("portfolio.current_price")}
          value={row?.currentPrice}
        />
        <Metric label={t("portfolio.value")} value={row?.value} />
      </div>

      {/* Footer */}
      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] md:text-sm text-muted/60">
            {t("portfolio.invested")}
          </p>
          <p className="text-sm md:text-lg lg:text-xl font-bold">
            {formatCurrency(row?.invested)}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[11px] md:text-sm text-muted/60">
            {t("portfolio.pnl")}
          </p>
          <p
            className={cn(
              "text-sm md:text-lg lg:text-xl font-extrabold",
              positive ? "text-emerald-200" : "text-rose-200",
            )}
          >
            {formatCurrency(row?.pnl)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
