import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { base_url } from "@/api/GlobalData";

/* ================= Utils ================= */

const formatMoney = (n: number) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const formatCompact = (n: number) =>
  new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

/* ================= Summary Card ================= */

const SummaryCard = ({ t, summary }: any) => {
  const profitPositive = Number(summary?.pnl || 0) >= 0;

  return (
    <div
      className={cn(
        "snap-start shrink-0 w-full sm:w-[420px]",
        "rounded-3xl p-6",
        "bg-gradient-to-br from-[#072522] via-[#0a2f2c] to-[#0f3a36]",
        "text-white shadow-lg"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">
            {t("portfolio.total_value")}
          </p>

          <p className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">
            {formatMoney(summary?.totalValue)}
          </p>
        </div>

        <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white/80" />
        </div>
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="flex flex-wrap gap-3">
        <div className="flex-1 min-w-[140px] rounded-xl bg-white/10 px-4 py-3">
          <p className="text-xs text-white/70 mb-1">
            {t("portfolio.invested")}
          </p>
          <p className="text-lg font-semibold">
            {formatMoney(summary?.totalInvested)}
          </p>
        </div>

        <div
          className={cn(
            "flex-1 min-w-[140px] rounded-xl px-4 py-3",
            profitPositive
              ? "bg-emerald-500/15 text-emerald-300"
              : "bg-rose-500/15 text-rose-300"
          )}
        >
          <p className="text-xs mb-1 opacity-80">{t("portfolio.pnl")}</p>
          <p className="text-lg font-semibold">{formatMoney(summary?.pnl)}</p>
        </div>
      </div>
    </div>
  );
};

/* ================= Company Card ================= */

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
        "snap-start shrink-0 w-full sm:w-[420px]",
        "rounded-3xl p-6 text-white shadow-lg",
        "bg-gradient-to-br from-[#072522] via-[#0a2f2c] to-[#0f3a36]"
      )}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-2xl bg-white/10 ring-1 ring-white/10 overflow-hidden flex items-center justify-center shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-extrabold text-white/80">
                {symbol.slice(0, 2)}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-extrabold text-white/85 tracking-wide">
              {symbol}
            </p>
            <p className="text-sm font-medium text-white/80 truncate">{name}</p>
            <p className="text-xs text-white/65 mt-1">
              {t("portfolio.shares")}:{" "}
              <span className="font-semibold text-white">
                {formatCompact(row?.shares)}
              </span>
            </p>
          </div>
        </div>
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="grid grid-cols-3 gap-3">
        <Metric label={t("portfolio.avg_price")} value={row?.avgPrice} />
        <Metric
          label={t("portfolio.current_price")}
          value={row?.currentPrice}
        />
        <Metric label={t("portfolio.value")} value={row?.value} />
      </div>

      <div className="mt-5 flex items-center justify-between">
        <div>
          <p className="text-[11px] text-white/60">{t("portfolio.invested")}</p>
          <p className="text-sm font-bold">{formatMoney(row?.invested)}</p>
        </div>

        <div className="text-right">
          <p className="text-[11px] text-white/60">{t("portfolio.pnl")}</p>
          <p
            className={cn(
              "text-sm font-extrabold",
              positive ? "text-emerald-200" : "text-rose-200"
            )}
          >
            {formatMoney(row?.pnl)}
          </p>
        </div>
      </div>
    </div>
  );
};

const Metric = ({ label, value }: any) => (
  <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-3">
    <p className="text-[11px] text-white/60">{label}</p>
    <p className="mt-1 text-base font-extrabold">{formatMoney(value)}</p>
  </div>
);

/* ================= Main Slider ================= */

export default function InvestmentsSlider({ t, portfolio, isRtl }: any) {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const summary = portfolio?.data?.summary || {};
  const assets = portfolio?.data?.assets || [];

  const updateProgress = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const max = el.scrollWidth - el.clientWidth;
    setScrollProgress(max > 0 ? (el.scrollLeft / max) * 100 : 0);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }}>
      <div
        ref={scrollerRef}
        onScroll={updateProgress}
        className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hidden"
      >
        <SummaryCard t={t} summary={summary} />
        {assets.map((row: any) => (
          <CompanyCard key={row.assetId} row={row} t={t} isRtl={isRtl} />
        ))}
      </div>

      <div className="mt-2 h-0.5 w-[90%] mx-auto bg-muted/30 rounded-full">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${scrollProgress}%`, backgroundColor: "#0a3330" }}
        />
      </div>
    </motion.div>
  );
}
