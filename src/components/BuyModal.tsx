import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "./ui/input";
import useBuyModal from "@/hooks/useBuyModal";
import { InvestmentEntity } from "@/interfaces/InvestmentEntity";

interface BuyModalProps {
  stock: InvestmentEntity | null;
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
  const {
    t,
    minQuantity,
    isLoading,
    totalCost,
    handleQuantityChange,
    handleQuantityInput,
    handleSubmit,
    description,
    setDescription,
    quantity,
  } = useBuyModal({ stock, tradeType: tradType, onClose });

  if (!stock) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center
                       bg-background/80 backdrop-blur-sm p-4 overflow-y-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          >
            <motion.div
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-md bg-white dark:bg-gray-800
                         rounded-2xl shadow-2xl p-5 max-h-[90vh] overflow-y-auto"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-5">
                <h2 className="text-lg font-bold">{stock.fullLegalName}</h2>
                <button onClick={onClose}>
                  <X />
                </button>
              </div>

              {/* PRICE */}
              <div className="bg-muted/50 rounded-xl p-3 mb-6 flex justify-between">
                <span>{t("share_price")}</span>
                <span className="font-bold">$ {stock.sharePrice}</span>
              </div>

              {/* QUANTITY */}
              <div className="flex gap-3 mb-6 justify-center">
                <Button
                  size="icon"
                  disabled={quantity <= minQuantity}
                  onClick={() => handleQuantityChange(-1)}
                >
                  <Minus />
                </Button>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => handleQuantityInput(e.target.value)}
                  className="w-24 text-center"
                />
                <Button size="icon" onClick={() => handleQuantityChange(1)}>
                  <Plus />
                </Button>
              </div>

              {/* DESCRIPTION */}
              <Input
                placeholder={t("description")}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mb-6"
              />

              {/* TOTAL */}
              <div className="rounded-xl border p-4 mb-6 flex justify-between">
                <span>{t("estimated_total")}</span>
                <span className="font-bold">$ {totalCost.toFixed(2)}</span>
              </div>

              {/* ACTIONS */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={onClose}>
                  {t("cancel")}
                </Button>
                <Button
                  className="flex-1"
                  variant={tradType === "sell" ? "destructive" : "success"}
                  onClick={handleSubmit}
                  disabled={isLoading}
                >
                  {isLoading ? t("processing") : t("send_request")}
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
