import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export const CheckVerificationModal = ({ isOpen, onClose, onVerify, mode }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;
  console.log("mode", mode);
  const isDraft = mode === "draft";
  const isPending = mode === "pending";

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          className="bg-card rounded-2xl shadow-xl max-w-md w-full p-6"
        >
          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center ${
                isDraft ? "bg-warning/10" : "bg-primary/10"
              }`}
            >
              {isDraft ? (
                <ShieldAlert className="w-7 h-7 text-warning" />
              ) : (
                <CheckCircle2 className="w-7 h-7 text-primary" />
              )}
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-center mb-2">
            {isDraft
              ? t("verification.acc_verification_req")
              : t("verification.verification_in_progress")}
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center mb-6">
            {isDraft
              ? t("verification.acc_verification_req_desc")
              : t("verification.verification_pending_desc")}
          </p>

          {/* Benefits only in draft */}
          {isDraft && (
            <div className="bg-muted/40 rounded-lg p-3 mb-6 text-sm">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>{t("verification.access_invest_opp")}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-success" />
                <span>{t("verification.buy_sell_securely")}</span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              {t("common.close")}
            </Button>

            {isDraft && (
              <Button className="flex-1" onClick={onVerify}>
                {t("verification.verify_now")}
              </Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
