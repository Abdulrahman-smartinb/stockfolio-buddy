import { useState } from "react";
import DocumentModal from "./DocumentModal";
import { useTranslation } from "react-i18next";
import { FileText } from "lucide-react";

const DocumentRow = ({ title, file }) => {
  const [open, setOpen] = useState(false);
  const { t, i18n } = useTranslation();

  const isRtl = i18n.language === "ar";

  if (!file) return null;

  return (
    <>
      <div
        onClick={() => setOpen(true)}
        role="button"
        tabIndex={0}
        className="
          flex items-center justify-between
          px-4 py-3
          transition
          cursor-pointer
          hover:bg-muted/40
          active:scale-[0.99]
        "
      >
        <div className="flex items-center gap-3">
          <FileText className="w-5 h-5 jadwa-icon-gold" />

          <div>
            <p className="text-sm font-medium text-foreground">{title}</p>
            <p className="text-xs text-jadwa-muted">
              {t("fund.click_view_document")}
            </p>
          </div>
        </div>

        <span
          className={`
            text-sm opacity-40 transition
            ${isRtl ? "rotate-180" : ""}
          `}
        >
          →
        </span>
      </div>

      {open && (
        <DocumentModal
          title={title}
          file={file}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  );
};

export default DocumentRow;
