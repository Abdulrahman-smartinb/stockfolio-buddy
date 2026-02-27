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

export function VerifyAccountTermsModal({ isOpen, onClose, onAccept }: Props) {
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
          {/* Header */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 jadwa-icon-gold" />
              <h2 className="text-lg font-semibold">
                {t("instructions.title")}
              </h2>
            </div>

            <button onClick={onClose}>
              <X className="w-5 h-5 jadwa-icon-gold" />
            </button>
          </div>

          {/* Content */}
          <div className="max-h-[65vh] overflow-y-auto px-6 py-4 space-y-5 text-sm leading-relaxed">
            <p className="text-jadwa-muted">{t("instructions.intro")}</p>

            <Section title={t("instructions.profile.title")}>
              <ul className="list-disc ps-5 space-y-1">
                <li>{t("instructions.profile.email")}</li>
                <li>{t("instructions.profile.id_number")}</li>
                <li>{t("instructions.profile.passport_number")}</li>
                <li>{t("instructions.profile.passport_image")}</li>
                <li>{t("instructions.profile.id_front")}</li>
                <li>{t("instructions.profile.id_back")}</li>
                <li>{t("instructions.profile.live_photo")}</li>
              </ul>
            </Section>
          </div>

          {/* Footer */}
          <div
            className={cn(
              "border-t px-6 py-4 flex gap-3",
              isRtl ? "justify-start" : "justify-end",
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

/* Helper Section */
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
