import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // <-- use your correct path
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
    shares,
    minShares,
    maxShares,
    quickShareOptions,
    totalCost,
    note,
    isLoading,

    setNote,
    increaseShares,
    decreaseShares,
    setSharesFromInput,
    submitTradeRequest,
    selectQuickOption,
  } = useBuyModal({
    stock,
    tradeType: tradType,
    onClose,
  });

  if (!isOpen || !stock) return null;

  const isMin = shares <= minShares;
  const isMax = shares >= maxShares;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-card rounded-2xl shadow-2xl border border-border p-5 max-h-[90vh] overflow-y-auto"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-bold">{stock.fullLegalName}</h2>
              <p className="text-xs text-muted-foreground">
                {t("min")}:{" "}
                <span className="font-mono tabular-nums">{minShares}</span> •{" "}
                {t("max")}:{" "}
                <span className="font-mono tabular-nums">{maxShares}</span>
              </p>
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              disabled={isLoading}
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Price */}
          <div className="bg-muted/50 rounded-xl p-3 mb-4 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t("share_price")}
            </span>
            <span className="font-bold">
              <span className="font-mono tabular-nums">
                $ {Number(stock.sharePrice || 0)}
              </span>
            </span>
          </div>

          {/* Quick options */}
          {!!quickShareOptions?.length && (
            <div className="mb-4">
              <div className="text-xs text-muted-foreground mb-2">
                {t("quick_select") || "Quick select"}
              </div>
              <div className="flex flex-wrap gap-2">
                {quickShareOptions.map((opt) => (
                  <Button
                    key={opt}
                    type="button"
                    variant={opt === shares ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectQuickOption(opt)}
                    disabled={isLoading}
                    className="font-mono tabular-nums"
                  >
                    {opt}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          <div className="mb-5">
            <div className="text-xs text-muted-foreground mb-2">
              {t("shares") || "Shares"}
            </div>

            <div className="flex gap-3 items-center justify-center">
              <Button
                size="icon"
                variant="outline"
                disabled={isLoading || isMin}
                onClick={decreaseShares}
              >
                <Minus className="w-4 h-4" />
              </Button>

              <Input
                type="number"
                value={shares}
                onChange={(e) => setSharesFromInput(e.target.value)}
                className="w-28 text-center font-mono tabular-nums"
                min={minShares}
                max={maxShares}
              />

              <Button
                size="icon"
                variant="outline"
                disabled={isLoading || isMax}
                onClick={increaseShares}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {(shares < minShares || shares > maxShares) && (
              <div
                className="mt-3 flex items-center justify-center gap-2 rounded-lg
                  border border-destructive/30 bg-destructive/10 px-3 py-2"
              >
                <span className="text-sm text-destructive font-medium">
                  {t("shares_out_of_range")}
                </span>
              </div>
            )}
          </div>

          {/* Note */}
          <div className="mb-5">
            <div className="text-xs text-muted-foreground mb-2">
              {t("description")}
            </div>
            <Input
              placeholder={t("description")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* Total */}
          <div className="rounded-xl border p-4 mb-6 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t("estimated_total")}
            </span>
            <span className="font-bold font-mono tabular-nums">
              $ {Number(totalCost || 0).toFixed(2)}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("cancel")}
            </Button>

            <Button
              className="flex-1"
              variant={tradType === "sell" ? "destructive" : "success"}
              onClick={submitTradeRequest}
              disabled={isLoading || shares < minShares || shares > maxShares}
            >
              {isLoading ? t("processing") : t("send_request")}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
