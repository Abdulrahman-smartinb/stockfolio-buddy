import { X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface GlobalModalProps {
  isOpen: boolean;
  onSubmit: () => void;
  title: string;
  content: any;
  isLoading: boolean;
  butText?: string;
  onClose: () => void;
}

const GlobalModal = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  content,
  isLoading = false,
  butText,
}: GlobalModalProps) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-[600px]">
        {/* Modal Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-lg font-semibold capitalize">{title}</h3>
          <button
            className="btn btn-xs btn-icon btn-light jadwa-icon-gold"
            onClick={onClose}
          >
            <X />
          </button>
        </div>

        {/* Modal Body */}
        <div className="modal-body mt-4">
          {content}
          {isLoading && (
            <p className="text-gray-500">
              <span>{t("loading")}</span>
            </p>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex justify-end gap-2 mt-4">
          <button
            className="flex items-center gap-1 text-xs sm:text-sm text-destructive"
            onClick={onClose}
            disabled={isLoading}
          >
            <span>{t("cancel")}</span>
          </button>
          <button
            className="flex items-center gap-1 text-xs sm:text-sm text-primary"
            onClick={onSubmit}
            disabled={isLoading}
          >
            {isLoading ? (
              <span>{t("loading")}</span>
            ) : (
              butText || <span>{t("send_request")}</span>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GlobalModal;
