import { motion, AnimatePresence } from "framer-motion";
import { FileText, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onAccept?: () => void;
};

export function PlatformTermsModal({ isOpen, onClose, onAccept }: Props) {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

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
          transition={{ type: "spring", stiffness: 260, damping: 25 }}
          dir={isRtl ? "rtl" : "ltr"}
          className="bg-card rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden"
        >
          {/* ===== Header ===== */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold">{t("terms.title")}</h2>
            </div>

            <button onClick={onClose}>
              <X className="w-5 h-5 text-muted-foreground hover:text-foreground" />
            </button>
          </div>

          {/* ===== Content ===== */}
          <div className="max-h-[65vh] overflow-y-auto px-6 py-4 space-y-5 text-sm leading-relaxed">
            <p className="text-muted-foreground">{t("terms.intro")}</p>

            <Section title={t("terms.definitions.title")}>
              <ul className="list-disc ps-5 space-y-1">
                <li>{t("terms.definitions.platform")}</li>
                <li>{t("terms.definitions.company")}</li>
                <li>{t("terms.definitions.user")}</li>
                <li>{t("terms.definitions.account")}</li>
                <li>{t("terms.definitions.services")}</li>
              </ul>
            </Section>

            <Section title={t("terms.eligibility.title")}>
              <ul className="list-disc ps-5 space-y-1">
                <li>{t("terms.eligibility.1")}</li>
                <li>{t("terms.eligibility.2")}</li>
                <li>{t("terms.eligibility.3")}</li>
              </ul>
            </Section>

            <Section title={t("terms.risks.title")}>
              <ul className="list-disc ps-5 space-y-1">
                <li>{t("terms.risks.1")}</li>
                <li>{t("terms.risks.2")}</li>
                <li>{t("terms.risks.3")}</li>
              </ul>
            </Section>

            <Section title={t("terms.liability.title")}>
              <ul className="list-disc ps-5 space-y-1">
                <li>{t("terms.liability.1")}</li>
                <li>{t("terms.liability.2")}</li>
              </ul>
            </Section>

            <Section title={t("terms.law.title")}>
              <p>{t("terms.law.text")}</p>
            </Section>
          </div>

          {/* ===== Footer ===== */}
          <div
            className={cn(
              "border-t px-6 py-4 flex gap-3",
              isRtl ? "justify-start" : "justify-end"
            )}
          >
            <Button variant="outline" onClick={onClose}>
              {t("common.close")}
            </Button>

            {onAccept && (
              <Button onClick={onAccept}>{t("common.accept")}</Button>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ===== Helper Section ===== */
function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="font-semibold mb-2">{title}</h3>
      {children}
    </div>
  );
}
