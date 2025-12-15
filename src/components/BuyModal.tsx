import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, TrendingUp, AlertCircle, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Stock, useBuyStockMutation } from "@/store/api/stocksApi";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface BuyModalProps {
  stock: Stock | null;
  isOpen: boolean;
  onClose: () => void;
}

export const BuyModal = ({ stock, isOpen, onClose }: BuyModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [buyStock, { isLoading }] = useBuyStockMutation();
  const { toast } = useToast();

  if (!stock) return null;

  const totalCost = stock.price * quantity;
  const isPositive = stock.change >= 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 1000) {
      setQuantity(newQuantity);
    }
  };

  const handleBuy = async () => {
    try {
      await buyStock({
        stockId: stock.id,
        quantity,
        price: stock.price,
      }).unwrap();
      
      toast({
        title: "Order Executed!",
        description: `Successfully purchased ${quantity} shares of ${stock.symbol} at $${stock.price.toFixed(2)}`,
      });
      onClose();
      setQuantity(1);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "Unable to complete your order. Please try again.",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4"
          >
            <div className="glass-card rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="font-bold text-primary">{stock.symbol.slice(0, 2)}</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">{stock.symbol}</h2>
                    <p className="text-sm text-muted-foreground">{stock.name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Price Info */}
              <div className="bg-muted/50 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-muted-foreground">Current Price</span>
                  <span className="text-2xl font-bold text-foreground">
                    ${stock.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Today's Change</span>
                  <div className={cn(
                    "flex items-center gap-1",
                    isPositive ? "text-success" : "text-destructive"
                  )}>
                    {isPositive ? <TrendingUp className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                    <span className="font-medium">
                      {isPositive ? "+" : ""}{stock.change.toFixed(2)} ({stock.changePercent.toFixed(2)}%)
                    </span>
                  </div>
                </div>
              </div>

              {/* Quantity Selector */}
              <div className="mb-6">
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Number of Shares
                </label>
                <div className="flex items-center justify-center gap-4">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="h-12 w-12 rounded-xl"
                  >
                    <Minus className="w-5 h-5" />
                  </Button>
                  <div className="w-24 text-center">
                    <span className="text-4xl font-bold text-foreground">{quantity}</span>
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= 1000}
                    className="h-12 w-12 rounded-xl"
                  >
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Total */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Estimated Total</span>
                  <span className="text-2xl font-bold text-primary">
                    ${totalCost.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  variant="success"
                  className="flex-1"
                  onClick={handleBuy}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full"
                      />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Buy Now
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
