import { useTranslation } from "react-i18next";

const UploadCard = ({ label, preview, alreadyUploaded, onFile }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <p className="text-[12px] md:text-sm font-medium text-gray-700">
          {label}
        </p>

        <label className="cursor-pointer">
          <span
            className="
            text-[11px] md:text-xs
            px-3 py-1.5
            rounded-md
            border border-gray-200
            text-gray-600
            hover:border-gray-400
            transition
          "
          >
            {t("verification.click_upload")}
          </span>

          <input
            type="file"
            accept="image/*,.pdf"
            hidden
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              onFile(file);
            }}
          />
        </label>
      </div>

      {alreadyUploaded && !preview && (
        <div className="text-[10px] text-gray-500">
          <div className="rounded-lg border border-green-200 bg-green-50 px-3 py-2 text-xs text-green-700">
            ✓ {t("verification.already_uploaded")}
          </div>{" "}
          {t("verification.replacing_notice")}
        </div>
      )}

      {preview && (
        <div className="rounded-lg border border-gray-100 bg-gray-50 p-2">
          <img
            src={preview}
            alt="preview"
            className="rounded-md max-h-40 w-full object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default UploadCard;
