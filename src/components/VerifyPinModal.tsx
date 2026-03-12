import { AnimatePresence, motion } from "framer-motion";
import { Eye, EyeOff, ShieldCheck, X } from "lucide-react";

type PinCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onResend?: () => void;
  pinCode: string;
  setPinCode: React.Dispatch<React.SetStateAction<string>>;
  showPin: boolean;
  setShowPin: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading?: boolean;
  t: (key: string) => string;
};

const onlyDigits = (value: string) => value.replace(/\D/g, "").slice(0, 6);

export const PinCodeModal = ({
  isOpen,
  onClose,
  onSubmit,
  onResend,
  pinCode,
  setPinCode,
  showPin,
  setShowPin,
  isLoading = false,
  t,
}: PinCodeModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-md rounded-3xl bg-white shadow-2xl border border-border/60 overflow-hidden"
          >
            <div className="flex items-center justify-between px-6 py-5 border-b">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="text-lg font-bold">
                    {t("auth.pin_verify_title")}
                  </h3>
                  <p className="text-sm text-jadwa-muted">
                    {t("auth.pin_verify_desc")}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-full hover:bg-muted transition"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <form onSubmit={onSubmit} className="px-6 py-6 space-y-5">
              <div>
                <label className="text-xs font-medium text-jadwa-muted mb-2 block">
                  {t("auth.pin_code")}
                </label>

                <div className="relative">
                  <input
                    type={showPin ? "text" : "password"}
                    inputMode="numeric"
                    autoComplete="one-time-code"
                    maxLength={6}
                    value={pinCode}
                    onChange={(e) => setPinCode(onlyDigits(e.target.value))}
                    className="w-full h-12 rounded-2xl border border-input bg-background px-4 pe-12 text-center tracking-[0.45em] text-lg font-semibold outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    placeholder="••••••"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPin((v) => !v)}
                    className="absolute end-3 top-1/2 -translate-y-1/2 text-jadwa-muted hover:text-foreground"
                  >
                    {showPin ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs text-jadwa-muted">
                  {t("auth.pin_modal_hint")}
                </p>
              </div>

              <button
                type="submit"
                disabled={isLoading || pinCode.length !== 6}
                className={`w-full h-12 rounded-2xl text-white font-semibold transition ${
                  isLoading || pinCode.length !== 6
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-primary hover:bg-[#988662]"
                }`}
              >
                {isLoading ? t("common.loading") : t("auth.verify_pin")}
              </button>
              <button
                type="button"
                onClick={onResend}
                className="w-full text-sm text-primary hover:underline"
              >
                {t("auth.resend_code")}
              </button>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
