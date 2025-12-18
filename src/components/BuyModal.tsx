import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Minus,
  Plus,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Text,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InvestmentCompany,
  useCreatePurchaseRequestMutation,
} from "@/store/api/stocksApi";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { base_url, companyId } from "@/api/GlobalData";
import { UserData } from "@/store/api/authApi";
import { Input } from "./ui/input";
import "../../src/App.css";

interface BuyModalProps {
  stock: InvestmentCompany | null;
  isOpen: boolean;
  onClose: () => void;
}
const MOBILE_BREAKPOINT = 768;

export const BuyModal = ({ stock, isOpen, onClose }: BuyModalProps) => {
  const [isMobile, setIsMobile] = useState(false);

  // Hook to check screen size on mount and on resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const modalPositionClasses = isMobile ? "left-1 top-1" : "left-1/3 top-1/4";
  const baseClasses =
    "fixed -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-50 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-xl";
  const finalClassName = `${modalPositionClasses} ${baseClasses}`;

  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [createPurchaseRequest, { isLoading }] =
    useCreatePurchaseRequestMutation();
  const { toast } = useToast();
  const [user] = useState<UserData>(JSON.parse(localStorage.getItem("user")));
  const [qrPopup, setQrPopup] = useState(null);
  const [isPaid, setIsPaid] = useState(false);

  if (!stock) return null;

  const totalCost = stock?.sharePrice * quantity;
  const isPositive = stock?.change >= 0;

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 1000) {
      setQuantity(newQuantity);
    }
  };

  const handleBuy = async () => {
    try {
      await createPurchaseRequest({
        companyId: companyId,
        data: {
          investorId: user?._id,
          type: "buy",
          shares: quantity,
          sharePrice: stock?.sharePrice,
          description,
          paymentStatus: isPaid ? "paid" : "unpaid",
        },
      }).unwrap();

      toast({
        title: "Request sent",
        description: `Successfully sent request to buy ${quantity} shares of ${
          stock?.symbol
        } at $${stock?.sharePrice.toFixed(2)}`,
      });
      handleClose();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "Unable to complete your order. Please try again.",
      });
    }
  };

  const handleClose = () => {
    onClose();
    setDescription("");
    setQuantity(1);
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
            onClick={handleClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className={finalClassName}
          >
            <div className="glass-card rounded-2xl p-6 shadow-2xl">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-24 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="font-bold text-primary">
                      {stock?.symbol || "SMT"}
                    </span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      {stock?.companyName}
                    </h2>
                  </div>
                </div>
                <button
                  onClick={handleClose}
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
                    ${stock?.sharePrice?.toFixed(2) || "-"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Today's Change</span>
                  <div
                    className={cn(
                      "flex items-center gap-1",
                      isPositive ? "text-success" : "text-destructive"
                    )}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <AlertCircle className="w-4 h-4" />
                    )}
                    <span className="font-medium">
                      {isPositive ? "+" : ""}
                      {stock?.change?.toFixed(2) || "0"} (
                      {stock?.changePercent?.toFixed(2) || "0"}%)
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
                    <span className="text-4xl font-bold text-foreground">
                      {quantity}
                    </span>
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
              <div className="mb-6">
                <label className="text-sm font-medium text-muted-foreground mb-3 block">
                  Description (Optional)
                </label>
                <div className="flex items-center justify-center gap-4">
                  <div className="relative w-full">
                    <Text className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="pl-11"
                      required
                    />
                  </div>
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

              <p className="text-start mb-1">Payment status</p>
              <div className="flex items-center gap-3 mb-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={!isPaid}
                    onChange={() => setIsPaid(false)}
                    className="toggle toggle-primary"
                  />
                  <span className="text-sm text-muted-foreground">Unpaid</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="payment"
                    checked={isPaid}
                    onChange={() => setIsPaid(true)}
                    className="toggle toggle-primary"
                  />
                  <span className="text-sm text-muted-foreground">Paid</span>
                </label>
              </div>

              {isPaid && (
                <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center justify-between">
                    <div className="flex flex-col">
                      {stock?.bankQR?.length > 0 &&
                        stock?.bankQR.map((bank, i) => (
                          <span
                            key={i}
                            className="cursor-pointer text-sm font-bold text-primary me-2 text-start"
                            onClick={() =>
                              setQrPopup(
                                `${base_url}investmentCompanies/${bank.qrCode}`
                              )
                            }
                          >
                            {bank?.name}
                          </span>
                        ))}
                    </div>
                  </div>
                </div>
              )}
              {qrPopup && (
                <div
                  className="qr-modal-overlay"
                  onClick={() => setQrPopup(null)}
                >
                  <div
                    className="qr-modal-content"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      className="qr-close-btn"
                      onClick={() => setQrPopup(null)}
                    >
                      ✕
                    </button>

                    <img
                      src={qrPopup}
                      alt="QR Code"
                      className="qr-modal-image"
                    />
                  </div>
                </div>
              )}
              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={handleClose}
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
                        transition={{
                          repeat: Infinity,
                          duration: 1,
                          ease: "linear",
                        }}
                        className="w-4 h-4 border-2 border-success-foreground/30 border-t-success-foreground rounded-full"
                      />
                      Processing...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      Send Request
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
