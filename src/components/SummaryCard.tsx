import { Building2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/hooks/helpers";

const SummaryCard = ({ t, summary }: any) => {
  const profitPositive = Number(summary?.pnl || 0) >= 0;

  return (
    <div
      className={cn(
        "snap-start shrink-0 w-full sm:w-[400px]",
        "rounded-3xl p-6",
        "bg-gradient-to-br from-[#072522] via-[#0a2f2c] to-[#0f3a36]",
        "text-muted shadow-lg",
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-muted/70">
            {t("portfolio.total_value")}
          </p>

          <p className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight jadwa-icon-brown">
            {formatCurrency(summary?.totalValue)}
          </p>
        </div>

        <div className="h-11 w-11 rounded-xl bg-muted/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 jadwa-icon-brown" />
        </div>
      </div>

      <div className="my-5 h-px bg-muted/10" />

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[140px] rounded-xl bg-muted/10 px-4 py-3">
          <p className="text-xs md:text-xl text-muted/70 mb-1">
            {t("portfolio.invested")}
          </p>
          <p className="text-lg font-semibold md:text-2xl jadwa-icon-brown">
            {formatCurrency(summary?.totalInvested)}
          </p>
        </div>

        <div
          className={cn(
            "flex-1 min-w-[140px] rounded-xl px-4 py-3",
            profitPositive
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-rose-500/15 text-rose-300",
          )}
        >
          <p className="text-xs md:text-xl mb-1 opacity-80">
            {t("portfolio.pnl")}
          </p>
          <p className="text-lg  md:text-xl font-semibold">
            {formatCurrency(summary?.pnl)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;
