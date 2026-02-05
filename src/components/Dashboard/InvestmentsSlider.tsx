import { motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Building2,
  Wallet,
  TrendingUp,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { cn } from "@/lib/utils";

// tiny formatter (optional)
const formatMoney = (n) =>
  new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
  }).format(Number(n || 0));

const formatCompact = (n) =>
  new Intl.NumberFormat(undefined, {
    notation: "compact",
    maximumFractionDigits: 2,
  }).format(Number(n || 0));

const toneClass = (tone) => {
  const map = {
    green: "text-emerald-600 bg-emerald-50 ring-emerald-100",
    red: "text-rose-600 bg-rose-50 ring-rose-100",
    blue: "text-sky-600 bg-sky-50 ring-sky-100",
    gray: "text-slate-700 bg-slate-50 ring-slate-100",
    amber: "text-amber-700 bg-amber-50 ring-amber-100",
    purple: "text-violet-700 bg-violet-50 ring-violet-100",
  };
  return map[tone] || map.gray;
};

const Chip = ({ children, tone = "gray" }) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold ring-1",
      toneClass(tone)
    )}
  >
    {children}
  </span>
);

const SummaryCard = ({ t, summary }) => {
  const profitPositive = summary.pnl >= 0;

  return (
    <div
      className={cn(
        "snap-start shrink-0 w-full sm:w-[420px]",
        "rounded-3xl p-6",
        "bg-gradient-to-br from-[#072522] via-[#0a2f2c] to-[#0f3a36]",
        "text-white shadow-lg"
      )}
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs uppercase tracking-wide text-white/70">
            {t("total_investments") ?? "Total Investments"}
          </p>

          {/* MAIN NUMBER */}
          <p className="mt-2 text-4xl md:text-5xl font-extrabold tracking-tight">
            {formatMoney(summary.totalValue)}
          </p>
        </div>

        <div className="h-11 w-11 rounded-xl bg-white/10 flex items-center justify-center">
          <Building2 className="w-5 h-5 text-white/80" />
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-white/10" />

      {/* Bottom stats */}
      <div className="flex flex-wrap gap-3">
        {/* Invested */}
        <div className="flex-1 min-w-[140px] rounded-xl bg-white/10 px-4 py-3">
          <p className="text-xs text-white/70 mb-1">
            {t("invested") ?? "Invested"}
          </p>
          <p className="text-lg font-semibold">
            {formatMoney(summary.totalInvested)}
          </p>
        </div>

        {/* PnL */}
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
          <p className="text-lg font-semibold">{formatMoney(summary.pnl)}</p>
        </div>
      </div>
    </div>
  );
};

const CompanyCard = ({ item }) => {
  const positive = item.changePct >= 0;

  return (
    <div
      className={cn(
        "snap-start shrink-0 w-full sm:w-[420px]",
        "rounded-3xl p-6 text-white shadow-lg",
        // Jadwa palette
        "bg-gradient-to-br from-[#072522] via-[#0a2f2c] to-[#0f3a36]"
      )}
    >
      {/* Top row */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo */}
          <div className="h-12 w-12 rounded-2xl bg-white/10 ring-1 ring-white/10 overflow-hidden flex items-center justify-center shrink-0">
            {item.logo ? (
              <img
                src={item.logo}
                alt={item.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-extrabold tracking-wide text-white/80">
                {String(item.symbol || item.name || "?")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>

          {/* Name + meta */}
          <div className="min-w-0">
            <div className="flex items-center gap-2 min-w-0">
              <p className="text-sm font-semibold truncate">{item.name}</p>
              <span className="text-[11px] text-white/60 shrink-0">
                {item.symbol}
              </span>
            </div>

            <p className="text-xs text-white/65 mt-1">
              Shares:{" "}
              <span className="font-semibold text-white">
                {formatCompact(item.shares)}
              </span>
            </p>
          </div>
        </div>

        {/* Change pill */}
        <div
          className={cn(
            "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-bold ring-1",
            positive
              ? "bg-emerald-500/15 text-emerald-200 ring-emerald-400/20"
              : "bg-rose-500/15 text-rose-200 ring-rose-400/20"
          )}
        >
          {positive ? "+" : ""}
          {Number(item.changePct || 0).toFixed(2)}%
        </div>
      </div>

      {/* Divider */}
      <div className="my-5 h-px bg-white/10" />

      {/* Middle stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-3">
          <p className="text-[11px] text-white/60">Avg price</p>
          <p className="mt-1 text-base font-extrabold tracking-tight">
            {formatMoney(item.avgPrice)}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-3">
          <p className="text-[11px] text-white/60">Current</p>
          <p className="mt-1 text-base font-extrabold tracking-tight">
            {formatMoney(item.currentPrice)}
          </p>
        </div>

        <div className="rounded-2xl bg-white/10 ring-1 ring-white/10 p-3">
          <p className="text-[11px] text-white/60">Value</p>
          <p className="mt-1 text-base font-extrabold tracking-tight">
            {formatMoney(item.value)}
          </p>
        </div>
      </div>

      {/* Bottom row */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[11px] text-white/60">Invested</p>
          <p className="text-sm font-bold text-white truncate">
            {formatMoney(item.invested)}
          </p>
        </div>

        <div className="text-right shrink-0">
          <p className="text-[11px] text-white/60">P/L</p>
          <p
            className={cn(
              "text-sm font-extrabold",
              item.pnl >= 0 ? "text-emerald-200" : "text-rose-200"
            )}
          >
            {formatMoney(item.pnl)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function InvestmentsSlider({ t }) {
  const scrollerRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);
  const [scrollProgress, setScrollProgress] = useState(0);

  const updateScrollProgress = () => {
    const el = scrollerRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    const progress = maxScroll > 0 ? (el.scrollLeft / maxScroll) * 100 : 0;

    setScrollProgress(progress);
  };

  // ✅ STATIC DATA (replace later with API)
  const data = useMemo(() => {
    const companies = [
      {
        id: "1",
        name: "Jadwa Tech Fund",
        symbol: "JTF",
        shares: 5500,
        avgPrice: 8.25,
        currentPrice: 10.0,
        invested: 45375,
        value: 55000,
        pnl: 9625,
        changePct: 2.3,
        logo: null,
      },
      {
        id: "2",
        name: "Smart Fund 2",
        symbol: "SM2",
        shares: 500,
        avgPrice: 12.0,
        currentPrice: 11.2,
        invested: 6000,
        value: 5600,
        pnl: -400,
        changePct: -1.1,
        logo: null,
      },
      {
        id: "3",
        name: "Smart Fund",
        symbol: "SMT",
        shares: 100,
        avgPrice: 5.0,
        currentPrice: 5.4,
        invested: 500,
        value: 540,
        pnl: 40,
        changePct: 0.8,
        logo: null,
      },
    ];

    const totalInvested = companies.reduce((s, x) => s + x.invested, 0);
    const totalValue = companies.reduce((s, x) => s + x.value, 0);
    const pnl = totalValue - totalInvested;

    return {
      summary: { totalInvested, totalValue, pnl },
      companies,
    };
  }, []);

  const updateArrows = () => {
    const el = scrollerRef.current;
    if (!el) return;
    const { scrollLeft, scrollWidth, clientWidth } = el;
    setCanScrollLeft(scrollLeft > 4);
    setCanScrollRight(scrollLeft + clientWidth < scrollWidth - 4);
  };

  const scrollByCard = (dir) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(420, el.clientWidth * 0.9);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
      className="mb-4"
    >
      {/* Header */}
      <div className="flex items-end justify-between gap-3 mb-3">
        {/* Desktop arrows */}
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

      {/* Slider */}
      <div
        ref={scrollerRef}
        onScroll={() => {
          updateArrows();
          updateScrollProgress();
        }}
        onMouseEnter={() => {
          updateArrows();
          updateScrollProgress();
        }}
        className={cn(
          "flex gap-4 overflow-x-auto ",
          "snap-x snap-mandatory",
          "scrollbar-hidden"
        )}
      >
        <SummaryCard t={t} summary={data.summary} />
        {data.companies.map((c) => (
          <CompanyCard key={c.id} item={c} />
        ))}
        {/* right padding so last card has breathing room */}
        <div className="shrink-0 w-2" />
      </div>

      {/* Scroll progress */}
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
