import { motion } from "framer-motion";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Stock } from "@/store/api/stocksApi";
import { cn } from "@/lib/utils";

interface StockCardProps {
  stock: Stock;
  onClick: () => void;
  index: number;
}

export const StockCard = ({ stock, onClick, index }: StockCardProps) => {
  const isPositive = stock.change >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="glass-card rounded-xl p-5 cursor-pointer group hover:border-primary/30 transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
              <span className="font-bold text-sm text-primary">{stock.symbol.slice(0, 2)}</span>
            </div>
            <div>
              <h3 className="font-bold text-foreground group-hover:text-primary transition-colors">
                {stock.symbol}
              </h3>
              <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                {stock.name}
              </p>
            </div>
          </div>
        </div>
        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium",
          isPositive ? "bg-success/10 text-success" : "bg-destructive/10 text-destructive"
        )}>
          {isPositive ? (
            <TrendingUp className="w-3 h-3" />
          ) : (
            <TrendingDown className="w-3 h-3" />
          )}
          {Math.abs(stock.changePercent).toFixed(2)}%
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-2xl font-bold text-foreground">
            ${stock.price.toFixed(2)}
          </p>
          <p className={cn(
            "text-sm font-medium",
            isPositive ? "text-success" : "text-destructive"
          )}>
            {isPositive ? "+" : ""}{stock.change.toFixed(2)}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Volume</p>
          <p className="text-sm font-medium text-foreground">
            {(stock.volume / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border/50">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Market Cap</span>
          <span className="font-medium text-foreground">{stock.marketCap}</span>
        </div>
      </div>
    </motion.div>
  );
};
