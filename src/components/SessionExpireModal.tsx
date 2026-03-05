import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/store";
import { resetSession } from "@/store/sessionSlice";
import { useNavigate } from "react-router-dom";
import { ShieldAlert } from "lucide-react";
import { useTranslation } from "react-i18next";

export const SessionExpiredModal = () => {
  const { t } = useTranslation();
  const expired = useSelector((state: RootState) => state.session.expired);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  if (!expired) return null;

  const handleRedirect = () => {
    dispatch(resetSession());
    navigate("/auth?reason=expired");
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-md">
      <div className="relative w-[420px] rounded-2xl bg-gradient-to-br from-[#072522] via-[#0a2f2c] to-[#0f3a36] p-8 shadow-2xl border border-white/10 animate-fadeIn">
        {/* Glow Effect */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#072522]/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-[#988662]/20 rounded-full blur-3xl"></div>

        <ShieldAlert color="white" className="mx-auto" size={45} />

        <h2 className="text-2xl font-bold text-white text-center mb-4 tracking-wide">
          {t("auth.errors.session_timeout_title")}
        </h2>

        <p className="text-gray-300 text-center mb-8 leading-relaxed">
          {t("auth.errors.session_timeout_desc")}
          <br />
          {t("auth.errors.pls_login_again")}
        </p>

        <button
          onClick={handleRedirect}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#988662] to-[#b9a779]
          text-white font-semibold tracking-wide shadow-lg hover:scale-[1.02]
          transition-all duration-200"
        >
          {t("auth.errors.return_login")}
        </button>
      </div>
    </div>
  );
};
