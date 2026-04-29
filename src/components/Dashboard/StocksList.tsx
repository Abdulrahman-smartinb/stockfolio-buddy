import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { cn } from "@/lib/utils";
import StockListItem from "./StockListItem";

const StockListSkeleton = () => {
  return (
    <div className="space-y-2.5 sm:space-y-3">
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className={cn(
            "rounded-2xl border border-border/60 bg-background/60 backdrop-blur-xl",
            "shadow-sm px-3 py-3 sm:px-4 sm:py-4 animate-pulse"
          )}
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="h-10 w-10 rounded-xl bg-muted/50 sm:h-12 sm:w-12" />
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

const getAssetForStock = (stock: any, assets: any[] = []) =>
  assets.find((asset) => {
    const assetId = asset?.assetId || asset?.fund?._id || asset?.fund;
    return assetId === stock?._id;
  });

const StocksList = ({
  stocks = [],
  isLoading,
  t,
  lang,
  onAction,
  portfolioAssets = [],
}) => {
  if (isLoading) return <StockListSkeleton />;
  if (!isLoading && (!stocks || stocks.length === 0))
    return <EmptyState t={t} />;

  const [featuredStock, ...restStocks] = stocks;

  return (
    <div className="space-y-3 sm:space-y-4">
      {featuredStock && (
        <StockListItem
          t={t}
          lang={lang}
          key={featuredStock._id}
          stock={featuredStock}
          index={0}
          featured
          portfolioAsset={getAssetForStock(featuredStock, portfolioAssets)}
          onAction={(type) => onAction?.(featuredStock, type)}
        />
      )}

      <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 xl:grid-cols-3">
        {restStocks.map((stock, index) => (
          <StockListItem
            t={t}
            lang={lang}
            key={stock._id}
            stock={stock}
            index={index + 1}
            portfolioAsset={getAssetForStock(stock, portfolioAssets)}
            onAction={(type) => onAction?.(stock, type)}
          />
        ))}
      </div>
    </div>
  );
};

export default StocksList;
