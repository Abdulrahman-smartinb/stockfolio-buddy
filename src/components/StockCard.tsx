import { motion } from "framer-motion";
import { cn, formatNumber, formatNumberCompact } from "@/lib/utils";
import { InvestmentCompany } from "@/store/api/stocksApi";
import {
  Search,
  TrendingUp,
  Activity,
  DollarSign,
  BarChart3,
  TrendingDown,
} from "lucide-react";
interface StockCardProps {
  stock: InvestmentCompany;
  onAction: (type: "buy" | "sell") => void;
  index: number;
}

export const StockCard = ({ stock, onAction, index }: StockCardProps) => {
  const availabilityRatio =
    stock?.totalShares && stock?.availableShares
      ? (stock?.availableShares / stock?.totalShares) * 100
      : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      className="glass-card rounded-xl p-5 cursor-pointer hover:border-primary/30 transition-all duration-300"
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-3 mb-4">
        <div className="flex gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary">
            {stock?.symbol?.toUpperCase()}
          </div>

          <div>
            <h3 className="font-bold text-foreground">{stock?.companyName}</h3>
            <p className="text-xs text-muted-foreground">
              {stock?.industry || "—"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => onAction("buy")}
            className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-primary"
          >
            <TrendingUp className={`w-5 h-5 text-success`} />
          </button>
          <button
            onClick={() => onAction("sell")}
            className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center font-bold text-danger"
          >
            <TrendingDown className={`w-5 h-5 text-destructive`} />
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="mb-3">
        <p className="text-4xl font-bold text-foreground">
          {stock?.currency || "$"} {stock?.sharePrice?.toFixed(2) ?? "—"}
        </p>
        <p className="text-xs text-muted-foreground">Price per share</p>
      </div>

      {/* Shares */}
      {/* <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground">Available Shares</span>
        <span className="font-medium text-foreground">
          {stock?.availableShares ?? 0}
        </span>
      </div> */}

      {/* Availability Bar */}
      {/* <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
        <div
          className={cn(
            "h-full rounded-full",
            availabilityRatio > 30 ? "bg-success" : "bg-destructive"
          )}
          style={{ width: `${availabilityRatio}%` }}
        />
      </div> */}

      {/* Valuation */}
      {/* <div className="mt-4 pt-4 border-t border-border/50 flex justify-between text-xs">
        <span className="text-muted-foreground">Valuation</span>
        <span className="font-medium text-foreground">
          {stock?.valuation
            ? `${stock?.currency || "$"} ${formatNumberCompact(
                stock?.sharePrice * stock.totalShares,
                2
              )}`
            : "—"}
        </span>
      </div> */}
    </motion.div>
  );
};
