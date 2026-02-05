import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Building2 } from "lucide-react";
import { useMemo, useRef, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { base_url } from "@/api/GlobalData";

// formatters
const formatMoney = (n) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const formatCompact = (n) =>
  new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const SummaryCard = ({ t, summary }) => {
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
            {t("total_investments") ?? "Total Investments"}
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
            {t("invested") ?? "Invested"}
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
          <p className="text-xs mb-1 opacity-80">
            {t("pnl") ?? "Profit / Loss"}
          </p>
          <p className="text-lg font-semibold">{formatMoney(summary?.pnl)}</p>
        </div>
      </div>
    </div>
  );
};

const CompanyCard = ({ row }) => {
  const fund = row?.fund || {};
  const positive = Number(row?.pnl || 0) >= 0;

  const name = fund?.fullLegalName || "—";
  const symbol = fund?.code || "";
  const logoUrl = fund?.logo
    ? `${base_url}/InvestmentFunds/${fund.logo}`
    : null;

  // changePct doesn't exist in your response — keep it optional
  const changePct = Number(row?.changePct || 0);

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
              <span className="text-sm font-extrabold tracking-wide text-white/80">
                {String(symbol || name)
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-extrabold text-white/85 tracking-wide">
              {symbol}
            </p>
            <p className="text-sm font-medium text-white/80 truncate">{name}</p>
            <p className="text-xs text-white/65 mt-1">
              Shares:{" "}
              <span className="font-semibold text-white">
                {formatCompact(row?.shares)}
              </span>
            </p>
          </div>
        </div>

        {/* If you don't have changePct yet, hide it automatically */}
        {row?.changePct != null && (
          <div
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
              changePct >= 0
                ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/20"
                : "bg-rose-500/15 text-rose-200 ring-rose-400/20"
            )}
          >
            {changePct >= 0 ? "+" : ""}
            {changePct.toFixed(2)}%
          </div>
        )}
      </div>

      <div className="my-5 h-px bg-white/10" />

      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-3">
          <p className="text-[11px] text-white/60">Avg price</p>
          <p className="mt-1 text-base font-extrabold tracking-tight">
            {formatMoney(row?.avgPrice)}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-3">
          <p className="text-[11px] text-white/60">Current</p>
          <p className="mt-1 text-base font-extrabold tracking-tight">
            {formatMoney(row?.currentPrice)}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-3">
          <p className="text-[11px] text-white/60">Value</p>
          <p className="mt-1 text-base font-extrabold tracking-tight">
            {formatMoney(row?.value)}
          </p>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] text-white/60">Invested</p>
          <p className="text-sm font-bold text-white truncate">
            {formatMoney(row?.invested)}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[11px] text-white/60">P/L</p>
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

export default function InvestmentsSlider({ t, portfolio, loading }) {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const summary = portfolio?.data?.summary || {};
  const assets = portfolio?.data?.assets || [];

  const updateArrowsAndProgress = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);

    const maxScroll = scrollWidth - clientWidth;
    const progress = maxScroll > 0 ? (scrollLeft / maxScroll) * 100 : 0;
    setScrollProgress(progress);
  };

  useEffect(() => {
    updateArrowsAndProgress();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [assets?.length]);

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(420, el.clientWidth * 0.9);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  if (!assets.length) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-4"
    >
      <div className="flex items-end justify-between gap-3 mb-3">
        <div className="hidden md:flex items-center gap-2">
          <button
            onClick={() => scrollByCard(-1)}
            disabled={!canScrollLeft}
            className={cn(
              "h-9 w-9 rounded-xl ring-1 ring-border/60 bg-background/50",
              "inline-flex items-center justify-center transition",
              canScrollLeft
                ? "hover:bg-muted/60 hover:ring-primary/30"
                : "opacity-40 cursor-not-allowed"
            )}
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <button
            onClick={() => scrollByCard(1)}
            disabled={!canScrollRight}
            className={cn(
              "h-9 w-9 rounded-xl ring-1 ring-border/60 bg-background/50",
              "inline-flex items-center justify-center transition",
              canScrollRight
                ? "hover:bg-muted/60 hover:ring-primary/30"
                : "opacity-40 cursor-not-allowed"
            )}
            aria-label="Scroll right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollerRef}
        onScroll={updateArrowsAndProgress}
        onMouseEnter={updateArrowsAndProgress}
        className={cn(
          "flex gap-4 overflow-x-auto",
          "snap-x snap-mandatory",
          "scrollbar-hidden"
        )}
        style={{ WebkitOverflowScrolling: "touch" }}
      >
        <SummaryCard t={t} summary={summary} />
        {assets.map((row) => (
          <CompanyCard key={row.assetId} row={row} />
        ))}
        <div className="shrink-0 w-2" />
      </div>

      <div className="mt-2 h-0.5 w-[90%] m-auto rounded-full bg-muted/30 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-150"
          style={{
            width: `${scrollProgress}%`,
            backgroundColor: "#0a3330",
          }}
        />
      </div>
    </motion.div>
  );
}
