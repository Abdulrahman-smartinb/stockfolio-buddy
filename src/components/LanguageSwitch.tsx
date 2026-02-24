import { RefreshCcw } from "lucide-react";
import { useTranslation } from "react-i18next";

const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <button
      onClick={() => i18n.changeLanguage(isAr ? "en" : "ar")}
      className="
          flex items-center gap-1
          px-3 py-1.5 rounded-full
          border border-border
          bg-[#fafafa]
          text-xs font-semibold text-[#042623]
          transition
          active:scale-[0.97]
        "
    >
      {isAr ? (
        <span className="font-tajawal pt-0.5">العربية</span>
      ) : (
        <span className="font-google">English</span>
      )}
      <RefreshCcw className="w-4 h-4 jadwa-icon-gold" />
      {isAr ? (
        <span className="font-google"> English </span>
      ) : (
        <span className="font-tajawal pt-0.5"> العربية </span>
      )}
    </button>
  );
};

export default LanguageSwitch;
