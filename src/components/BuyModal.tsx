import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus, CheckCircle, Text } from "lucide-react";
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

interface BuyModalProps {
  stock: InvestmentCompany | null;
  isOpen: boolean;
  tradType: string;
  onClose: () => void;
}

export const BuyModal = ({
  stock,
  isOpen,
  onClose,
  tradType,
}: BuyModalProps) => {
  const [quantity, setQuantity] = useState(1);
  const [description, setDescription] = useState("");
  const [isPaid, setIsPaid] = useState(false);
  const [qrPopup, setQrPopup] = useState<string | null>(null);

  const [createPurchaseRequest, { isLoading }] =
    useCreatePurchaseRequestMutation();

  const { toast } = useToast();
  const user: UserData | null = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  if (!stock) return null;

  const totalCost = stock.sharePrice * quantity;

  const handleQuantityChange = (delta: number) => {
    setQuantity((q) => Math.min(1000, Math.max(1, q + delta)));
  };

  const handleBuy = async () => {
    try {
      await createPurchaseRequest({
        companyId,
        data: {
          investorId: user?._id,
          type: tradType,
          shares: quantity,
          sharePrice: stock.sharePrice,
          description,
          paymentStatus: isPaid ? "paid" : "unpaid",
        },
      }).unwrap();

      toast({
        title: "Request sent",
        description: `Request to buy ${quantity} shares sent successfully.`,
      });

      onClose();
      setQuantity(1);
      setDescription("");
      setIsPaid(false);
    } catch {
      toast({
        variant: "destructive",
        title: "Order Failed",
        description: "Please try again.",
      });
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* OVERLAY (handles centering + scroll) */}
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-background/80 backdrop-blur-sm p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            {/* MODAL */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-md bg-white dark:bg-gray-800
                         rounded-2xl shadow-2xl p-5
                         max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* HEADER */}
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      "w-16 h-10 rounded-xl flex items-center justify-center font-bold",
                      tradType === "sell"
                        ? "bg-destructive/20 text-destructive"
                        : "bg-primary/20 text-primary"
                    )}
                  >
                    {stock.symbol}
                  </div>
                  <h2 className="text-lg font-bold">{stock.companyName}</h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-muted"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* PRICE */}
              <div className="bg-muted/50 rounded-xl p-3 mb-6 flex justify-between">
                <span className="text-muted-foreground">Share Price</span>
                <span className="text-xl font-bold">
                  ${stock.sharePrice.toFixed(2)}
                </span>
              </div>

              {/* QUANTITY */}
              <div className="flex items-center justify-center gap-4 mb-6">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus />
                </Button>
                <span className="text-6xl font-bold">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(1)}
                >
                  <Plus />
                </Button>
              </div>

              {/* DESCRIPTION */}
              <div className="mb-6">
                <label className="text-sm text-muted-foreground mb-2 block">
                  Description (Optional)
                </label>
                <div className="relative">
                  <Text className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    className="pl-10"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
              </div>

              {/* TOTAL */}
              <div
                className={cn(
                  "rounded-xl p-4 mb-6 flex justify-between border",
                  tradType === "sell"
                    ? "bg-destructive/5 border-destructive/20"
                    : "bg-primary/5 border-primary/20"
                )}
              >
                <span className="text-muted-foreground">Estimated Total</span>
                <span
                  className={cn(
                    "text-xl font-bold",
                    tradType === "sell" ? "text-destructive" : "text-primary"
                  )}
                >
                  ${totalCost.toFixed(2)}
                </span>
              </div>

              {/* PAYMENT */}
              {tradType === "buy" && (
                <div className="grid gap-3 mb-6">
                  {["unpaid", "paid"].map((type) => (
                    <label
                      key={type}
                      className={cn(
                        "rounded-xl border p-3 cursor-pointer transition",
                        (type === "paid") === isPaid
                          ? "border-primary bg-primary/5"
                          : "hover:bg-muted/40"
                      )}
                    >
                      <input
                        type="radio"
                        className="mr-2"
                        checked={(type === "paid") === isPaid}
                        onChange={() => setIsPaid(type === "paid")}
                      />
                      <strong className="capitalize">{type}</strong>
                    </label>
                  ))}
                </div>
              )}

              {/* BANK QR */}
              {isPaid && (
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {stock.bankQR?.map((bank, i) => (
                    <button
                      key={i}
                      onClick={() =>
                        setQrPopup(
                          `${base_url}investmentCompanies/${bank.qrCode}`
                        )
                      }
                      className="border rounded-xl p-3 text-sm font-semibold text-primary hover:bg-primary/10"
                    >
                      {bank.name}
                    </button>
                  ))}
                </div>
              )}

              {/* ACTIONS */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  Cancel
                </Button>
                <Button
                  variant={tradType === "sell" ? "destructive" : "success"}
                  className="flex-1"
                  onClick={handleBuy}
                  disabled={isLoading}
                >
                  {isLoading ? (
                    "Processing…"
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Send Request
                    </>
                  )}
                </Button>
              </div>
            </motion.div>
          </motion.div>

          {/* QR POPUP */}
          {qrPopup && (
            <div
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
              onClick={() => setQrPopup(null)}
            >
              <div
                className="bg-white dark:bg-gray-900 rounded-xl p-5 max-w-sm"
                onClick={(e) => e.stopPropagation()}
              >
                <img src={qrPopup} className="w-full rounded-lg" />
              </div>
            </div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};
