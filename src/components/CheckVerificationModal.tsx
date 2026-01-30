// src/components/VerifyAccountModal.jsx
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export const CheckVerificationModal = ({ isOpen, onClose, onVerify }) => {
  if (!isOpen) return null;

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
            <div className="w-14 h-14 rounded-full bg-warning/10 flex items-center justify-center">
              <ShieldAlert className="w-7 h-7 text-warning" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-lg font-semibold text-center mb-2">
            Account Verification Required
          </h2>

          {/* Description */}
          <p className="text-sm text-muted-foreground text-center mb-6">
            You are not registered as an investor yet. To buy or sell shares,
            you must verify your account first.
          </p>

          {/* Benefits */}
          <div className="bg-muted/40 rounded-lg p-3 mb-6 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Access investment opportunities</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-success" />
              <span>Buy & sell shares securely</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onClose}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={onVerify}>
              Verify Now
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
