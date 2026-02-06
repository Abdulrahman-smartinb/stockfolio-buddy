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

const PRIMARY = "#042623";

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
            rounded-2xl bg-white
            shadow-2xl border border-border/60
            p-5 max-h-[90vh] overflow-y-auto
          "
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.98 }}
          transition={{ type: "spring", stiffness: 260, damping: 26 }}
        >
          {/* ================= Header ================= */}
          <div className="flex items-start justify-between mb-5">
            <div>
              <h2 className="text-lg font-extrabold text-[#042623]">
                {isRtl ? stock?.nameAr : stock.fullLegalName}
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5">
                {t("shares.min")}:{" "}
                <span className="tabular-nums font-medium">
                  {formatNumber(minShares)}
                </span>{" "}
                • {t("shares.max")}:{" "}
                <span className="tabular-nums font-medium">
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
                hover:bg-muted/40 transition
              "
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* ================= Share Price ================= */}
          <div
            className="rounded-xl px-4 py-3 mb-4 flex justify-between items-center"
            style={{ backgroundColor: "rgba(4,38,35,0.06)" }}
          >
            <span className="text-sm text-muted-foreground">
              {t("shares.share_price")}
            </span>
            <span className="font-bold tabular-nums text-[#042623]">
              {formatCurrency(stock.sharePrice)}
            </span>
          </div>

          {/* ================= Quick Options ================= */}
          {!!quickShareOptions?.length && (
            <div className="mb-5">
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
                      className="
                        h-9 px-3 rounded-lg text-sm font-medium tabular-nums
                        ring-1 transition
                      "
                      style={{
                        backgroundColor: active
                          ? PRIMARY
                          : "rgba(4,38,35,0.05)",
                        color: active ? "#fff" : PRIMARY,
                        borderColor: "rgba(4,38,35,0.25)",
                      }}
                    >
                      {formatNumber(opt)}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= Quantity ================= */}
          <div className="mb-5">
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
                className="w-28 h-10 text-center font-semibold tabular-nums"
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
              <div className="mt-3 rounded-lg bg-red-50 text-red-600 px-3 py-2 text-sm text-center">
                {t("shares.shares_out_of_range")}
              </div>
            )}
          </div>

          {/* ================= Note ================= */}
          <div className="mb-5">
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
          <div
            className="rounded-xl px-4 py-3 mb-6 flex justify-between items-center"
            style={{ backgroundColor: "rgba(4,38,35,0.1)" }}
          >
            <span className="text-sm text-muted-foreground">
              {t("shares.estimated_total")}
            </span>
            <span className="text-lg font-extrabold tabular-nums text-[#042623]">
              {formatCurrency(totalCost)}
            </span>
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

            <button
              onClick={submitTradeRequest}
              disabled={isLoading || shares < minShares || shares > maxShares}
              className="
                flex-1 h-10 rounded-xl
                text-sm font-semibold text-white
                transition
                disabled:opacity-60 disabled:cursor-not-allowed
              "
              style={{
                backgroundColor: tradType === "sell" ? "#b91c1c" : PRIMARY,
              }}
            >
              {isLoading ? t("app.processing") : t("shares.send_request")}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
