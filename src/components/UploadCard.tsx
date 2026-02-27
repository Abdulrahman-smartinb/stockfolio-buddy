import { useTranslation } from "react-i18next";

const UploadCard = ({ label, preview, onFile }) => {
  const { t } = useTranslation();

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">{label}</p>

      <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-2xl h-40 cursor-pointer hover:bg-gray-50 transition">
        <span className="text-gray-400 text-sm">
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

      {preview && (
        <div className="rounded-xl border border-gray-200 p-3 bg-gray-50">
          <img src={preview} alt="preview" className="rounded-lg max-h-48" />
        </div>
      )}
    </div>
  );
};

export default UploadCard;
