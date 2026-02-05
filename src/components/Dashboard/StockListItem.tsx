import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight /* ArrowDownRight, ChevronRight */ } from "lucide-react";
import { cn } from "@/lib/utils";
import { base_url } from "@/api/GlobalData";

// helpers
const formatMoney = (n) => {
  const x = Number(n);
  if (!Number.isFinite(x)) return "-";
  return Intl.NumberFormat(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(x);
};

const StockListItem = ({ t, stock, index = 0, onAction }) => {
  const name = stock?.name || stock?.fullLegalName || "—";
  const symbol = stock?.symbol || stock?.code || "";
  const price = stock?.price ?? stock?.currentPrice ?? stock?.sharePrice;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: Math.min(index * 0.03, 0.25) }}
      className={cn(
        "group rounded-2xl border border-border/60",
        "bg-background/60 backdrop-blur-xl",
        "shadow-sm hover:shadow-md transition-shadow",
        "px-4 py-4"
      )}
    >
      <div className="flex items-center justify-between gap-4">
        {/* LEFT — Logo + Name */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Logo */}
          <div
            className={cn(
              "h-11 w-11 rounded-2xl ring-1 ring-border/60 overflow-hidden",
              "bg-muted/30 flex items-center justify-center shrink-0"
            )}
            style={{ boxShadow: "0 0 0 1px rgba(7,37,34,0.10)" }}
          >
            {stock?.logo ? (
              <img
                src={`${base_url}/InvestmentFunds/${stock.logo}`}
                alt={name}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-sm font-extrabold text-foreground/70">
                {String(symbol || name)
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            )}
          </div>

          {/* Name */}
          <div className="min-w-0">
            <div className="min-w-0">
              {symbol && (
                <p className="text-xs font-bold text-foreground tracking-wide">
                  {symbol}
                </p>
              )}
              {/* Name (thin) */}
              <p className="text-sm font-semibold text-muted-foreground truncate">
                {name}
              </p>

              {/* Symbol (bold, secondary tone) */}
            </div>

            {/* Secondary info — disabled for now */}
            {/*
            <div className="mt-1 text-xs text-muted-foreground">
              Market / shares / sector
            </div>
            */}
          </div>
        </div>

        {/* RIGHT — Price + Buy */}
        <div className="flex items-center gap-3">
          {/* Price */}
          <div className="text-right">
            <p className="text-base font-extrabold text-foreground">
              {price != null ? formatMoney(price) : "-"}
            </p>

            {/* Change % — disabled until data exists */}
            {/*
            <span className="text-xs text-muted-foreground">
              +0.00%
            </span>
            */}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1">
            {/* BUY */}
            <button
              onClick={() => onAction?.("buy", stock)}
              className={cn(
                "flex items-center gap-2",
                "h-9 px-4 rounded-full",
                "border border-border/60",
                "bg-white/70 hover:bg-muted/50",
                "text-sm font-medium",
                "transition-colors"
              )}
              style={{ color: "#072522" }}
            >
              <ArrowUpRight className="w-4 h-4" />
              <span>{t("buy")}</span>
            </button>

            {/* SELL — disabled for now */}
            {/*
            <button
              onClick={() => onAction?.("sell")}
              className="h-9 w-9 rounded-xl ring-1 ring-border/60"
            >
              <ArrowDownRight className="w-4 h-4" />
            </button>
            */}

            {/* DETAILS — disabled for now */}
            {/*
            <button
              onClick={() => onAction?.("details")}
              className="h-9 w-9 rounded-xl ring-1 ring-border/60"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            */}
          </div>
        </div>
      </div>

      {/* Brand accent line */}
      <div
        className={cn(
          "mt-3 h-1 w-full rounded-full overflow-hidden",
          "bg-muted/25 opacity-0 group-hover:opacity-100 transition"
        )}
      >
        <div
          className="h-full w-1/3"
          style={{
            background: "linear-gradient(90deg, #072522, rgba(7,37,34,0.15))",
          }}
        />
      </div>
    </motion.div>
  );
};

export default StockListItem;
