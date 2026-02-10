import React from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { base_url } from "@/api/GlobalData";
import { formatCurrency } from "@/hooks/helpers";

const StockListItem = ({ t, lang, stock, index = 0, onAction }) => {
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
        "bg-background/70 backdrop-blur-xl",
        "shadow-sm hover:shadow-md transition-all",
        "px-4 py-2"
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
            {symbol && (
              <p className="text-xs font-bold text-foreground tracking-wide">
                {symbol}
              </p>
            )}

            <p className="text-sm font-semibold text-muted-foreground truncate">
              {lang === "ar" && stock?.nameAr ? stock.nameAr : name}
            </p>
          </div>
        </div>

        {/* RIGHT — Price + Buy (STACKED) */}
        <div className="flex flex-col items-center  shrink-0">
          {/* Price */}
          <p
            className="text-xl font-semi-bold tracking-tight text-foreground"
            dir="ltr"
          >
            {price != null ? formatCurrency(price) : "—"}
          </p>

          {/* Buy */}
          <button
            onClick={() => onAction?.("buy", stock)}
            className={cn(
              "group inline-flex items-center justify-center ",
              "h-8 px-3 rounded-[30px]",
              "bg-primary text-primary-foreground",
              "text-sm font-semibold",
              "shadow-sm",
              "transition-all duration-200",
              "hover:shadow-md hover:-translate-y-[1px]",
              "active:translate-y-0 active:scale-[0.98]"
            )}
          >
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-[1px] group-hover:-translate-y-[1px]" />
            <span>{t("shares.buy")}</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default StockListItem;
