import { motion, AnimatePresence } from "framer-motion";
import { X, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useBuyModal from "@/hooks/useBuyModal";
import { InvestmentEntity } from "@/interfaces/InvestmentEntity";
import { formatCurrency, formatNumber } from "@/hooks/helpers";

interface BuyModalProps {
  stock: InvestmentEntity | null;
  isOpen: boolean;
  isRtl: boolean;
  tradType: string;
  onClose: () => void;
}

export const BuyModal = ({
  stock,
  isOpen,
  onClose,
  tradType,
  isRtl,
}: BuyModalProps) => {
  const {
    t,

    shares,
    minShares,
    maxShares,
    totalInput,
    totalCost,
    note,
    isLoading,

    setNote,
    increaseShares,
    decreaseShares,
    setSharesFromInput,
    setSharesFromTotal,
    selectQuickOption,
    submitTradeRequest,
    setTotalInput,

    quickShareOptions,
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          onClick={(e) => e.stopPropagation()}
          className="
            relative w-full max-w-md
            rounded-2xl bg-popover
            shadow-2xl border border-border
            p-6 max-h-[90vh] overflow-y-auto
          "
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          {/* ================= Header ================= */}
          <div className="flex items-start justify-between mb-6">
            <div>
              <h2 className="text-lg font-extrabold text-foreground">
                {isRtl ? stock?.nameAr : stock.fullLegalName}
              </h2>
              <p className="text-xs text-muted-foreground mt-1">
                {t("shares.min")}:{" "}
                <span className="font-medium tabular-nums">
                  {formatNumber(minShares)}
                </span>{" "}
                • {t("shares.max")}:{" "}
                <span className="font-medium tabular-nums">
                  {formatNumber(maxShares)}
                </span>
              </p>
            </div>

            <button
              onClick={onClose}
              disabled={isLoading}
              className="
                h-8 w-8 rounded-lg
                flex items-center justify-center
                text-muted-foreground
                hover:bg-muted transition
              "
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ================= Share Price ================= */}
          <div className="mb-5 rounded-xl bg-secondary/40 px-4 py-3 flex justify-between items-center">
            <span className="text-sm text-muted-foreground">
              {t("shares.share_price")}
            </span>
            <span className="font-extrabold tabular-nums text-foreground">
              {formatCurrency(stock.sharePrice)}
            </span>
          </div>

          {/* ================= Quick Options ================= */}
          {!!quickShareOptions?.length && (
            <div className="mb-6">
              <p className="text-xs text-muted-foreground mb-2">
                {t("shares.quick_select")}
              </p>
              <div className="flex flex-wrap gap-2">
                {quickShareOptions.map((opt) => {
                  const active = opt === shares;
                  return (
                    <button
                      key={opt}
                      onClick={() => selectQuickOption(opt)}
                      disabled={isLoading}
                      className={`
                        h-9 px-3 rounded-lg
                        text-sm font-semibold tabular-nums
                        border transition
                        ${
                          active
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted text-foreground border-border hover:bg-muted/70"
                        }
                      `}
                    >
                      {formatNumber(opt)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= Quantity ================= */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">
              {t("shares.shares")}
            </p>

            <div className="flex items-center justify-center gap-3">
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
                className="w-28 h-10 text-center font-bold tabular-nums"
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
          </div>

          {/* ================= Note ================= */}
          <div className="mb-6">
            <p className="text-xs text-muted-foreground mb-2">
              {t("shares.description")}
            </p>
            <Input
              placeholder={t("shares.description_optional")}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {/* ================= Total ================= */}
          <div className="mb-7 rounded-xl bg-primary/10 px-4 py-4">
            <p className="text-xs text-muted-foreground mb-2">
              {t("shares.estimated_total")}
            </p>

            <Input
              value={totalInput === "" ? totalCost : totalInput}
              onChange={(e) => setSharesFromTotal(e.target.value)}
              disabled={isLoading}
              inputMode="decimal"
              placeholder="0.00"
              className="text-center text-lg font-extrabold tabular-nums bg-background"
            />

            <p className="mt-1 text-[11px] text-muted-foreground text-center">
              {t("shares.total_hint")}
            </p>
          </div>

          {/* ================= Actions ================= */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={isLoading}
            >
              {t("app.cancel")}
            </Button>

            <Button
              onClick={submitTradeRequest}
              disabled={isLoading || shares < minShares || shares > maxShares}
              className="flex-1"
              variant={tradType === "sell" ? "destructive" : "default"}
            >
              {isLoading ? t("app.processing") : t("shares.send_request")}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
