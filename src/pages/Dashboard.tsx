import { useState } from "react";
import { motion } from "framer-motion";
import { Search, TrendingUp, Activity, DollarSign, BarChart3 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Header } from "@/components/Header";
import { StockCard } from "@/components/StockCard";
import { BuyModal } from "@/components/BuyModal";
import { useGetStocksQuery, Stock } from "@/store/api/stocksApi";

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStock, setSelectedStock] = useState<Stock | null>(null);
  const [isBuyModalOpen, setIsBuyModalOpen] = useState(false);

  const { data: stocks = [], isLoading } = useGetStocksQuery();

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleStockClick = (stock: Stock) => {
    setSelectedStock(stock);
    setIsBuyModalOpen(true);
  };

  const stats = [
    {
      label: "Market Status",
      value: "Open",
      icon: Activity,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Top Gainer",
      value: "+2.58%",
      subValue: "NVDA",
      icon: TrendingUp,
      color: "text-success",
      bgColor: "bg-success/10",
    },
    {
      label: "Total Volume",
      value: "324.5M",
      icon: BarChart3,
      color: "text-accent",
      bgColor: "bg-accent/10",
    },
    {
      label: "Portfolio Value",
      value: "$12,450",
      icon: DollarSign,
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Markets Overview
          </h1>
          <p className="text-muted-foreground">
            Track real-time stock prices and trade with confidence
          </p>
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 + index * 0.05 }}
              className="glass-card rounded-xl p-4"
            >
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg ${stat.bgColor} flex items-center justify-center`}>
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className={`text-lg font-bold ${stat.color}`}>{stat.value}</p>
                  {stat.subValue && (
                    <p className="text-xs text-muted-foreground">{stat.subValue}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6"
        >
          <div className="relative max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search stocks by name or symbol..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 h-12 bg-card"
            />
          </div>
        </motion.div>

        {/* Stocks Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="glass-card rounded-xl p-5 animate-pulse">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-muted shimmer" />
                    <div>
                      <div className="h-4 w-16 bg-muted rounded shimmer mb-2" />
                      <div className="h-3 w-24 bg-muted rounded shimmer" />
                    </div>
                  </div>
                </div>
                <div className="h-8 w-24 bg-muted rounded shimmer mb-2" />
                <div className="h-4 w-16 bg-muted rounded shimmer" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredStocks.map((stock, index) => (
              <StockCard
                key={stock.id}
                stock={stock}
                onClick={() => handleStockClick(stock)}
                index={index}
              />
            ))}
          </div>
        )}

        {!isLoading && filteredStocks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No stocks found</h3>
            <p className="text-muted-foreground">
              Try adjusting your search query
            </p>
          </motion.div>
        )}
      </main>

      <BuyModal
        stock={selectedStock}
        isOpen={isBuyModalOpen}
        onClose={() => {
          setIsBuyModalOpen(false);
          setSelectedStock(null);
        }}
      />
    </div>
  );
};

export default Dashboard;
