import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import StockListItem from "./StockListItem";

const StockListSkeleton = () => {
  return (
    <div className="space-y-3">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl",
            "shadow-sm px-4 py-4 animate-pulse",
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-muted/50" />
              <div className="min-w-0">
                <div className="h-4 w-36 bg-muted/50 rounded mb-2" />
                <div className="h-3 w-24 bg-muted/50 rounded" />
              </div>
            </div>
            <div className="text-right">
              <div className="h-5 w-20 bg-muted/50 rounded mb-2" />
              <div className="h-3 w-14 bg-muted/50 rounded ml-auto" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

const EmptyState = ({ t }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-16"
  >
    <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
      <Search className="w-8 h-8 jadwa-icon-gold" />
    </div>
    <h3 className="text-lg font-semibold text-foreground mb-2">
      {t("activity.no_records")}
    </h3>
    <p className="text-jadwa-muted">{t("app.adjust_query")}</p>
  </motion.div>
);

const StocksList = ({ stocks = [], isLoading, t, lang, onAction }) => {
  if (isLoading) return <StockListSkeleton />;
  if (!isLoading && (!stocks || stocks.length === 0))
    return <EmptyState t={t} />;

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
      {stocks.map((stock, index) => (
        <StockListItem
          t={t}
          lang={lang}
          key={stock._id}
          stock={stock}
          index={index}
          onAction={(type) => onAction?.(stock, type)}
        />
      ))}
    </div>
  );
};

export default StocksList;
