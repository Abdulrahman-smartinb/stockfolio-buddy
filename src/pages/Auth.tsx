import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeftCircle,
  ArrowRightCircle,
  AtSign,
  Mail,
  MessageCircleMore,
  ShieldCheck,
  User,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { PhoneInput } from "@/components/PhoneInput";
import { isMobile } from "@/hooks/helpers";
import { cn } from "@/lib/utils";
import logo from "../assets/images/investment-logo-large.png";
import { PlatformTermsModal } from "@/components/PlatformTermsModal";
import { useSearchParams } from "react-router-dom";
import LanguageSwitch from "@/components/LanguageSwitch";
import PasswordField from "@/components/PasswordField";
import Field from "@/components/Field";
import OtpInput from "@/components/OtpInput";

const Auth = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");

  const maskEmail = (email: string) => {
    const [name, domain] = email.split("@");

    if (!name || !domain) return email;

    return `${name.slice(0, 3)}****@${domain}`;
  };

  const {
    mode,
    setMode,
    showPassword,
    setShowPassword,
    showPin,
    setShowPin,
    formData,
    setFormData,
    isLoading,
    handleSubmit,
    showWarn,
    showLengthError,
    COUNTRIES,
    openTerms,
    setOpenTerms,
    approveTerms,
    setApproveTerms,
    termsError,
    setTermsError,
    otp,
    setOtp,
    newPassword,
    setNewPassword,
    resetEmail,
    setResetEmail,
    confirmNewPassword,
    setConfirmNewPassword,
  } = useAuth();

  return (
    <div
      className="min-h-screen flex bg-background"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <div className="absolute top-4 end-4 z-50">
        <LanguageSwitch />
      </div>
      {/* LEFT / BRAND (Desktop) */}
      <div
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(7,37,34,0.08), rgba(7,37,34,0.02))",
        }}
      >
        <div className="w-[50%] relative z-10 flex flex-col justify-center ps-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3">
              <img src={logo} alt="Jadwa" className="w-full" />
            </div>

            <h2 className="text-4xl font-bold leading-tight">
              {t("home.headline_1")}
              <br />
              <span>{t("home.headline_2")}</span>
            </h2>

            <p className="text-lg text-jadwa-muted max-w-md">
              {t("home.subtitle")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT / FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-lg"
        >
          {/* Mobile Logo */}
          <div className="lg:hidden flex justify-center items-center gap-2 mb-6">
            <img src={logo} alt="Jadwa Logo" className="w-[63%]" />
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-8 shadow-sm">
            {reason === "expired" && (
              <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 shadow-sm">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600 text-lg">
                    🔒
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-amber-900">
                      {t("auth.errors.session_timeout_title")}
                    </h3>

                    <p className="mt-1 text-[11px] sm:text-xs md:text-sm text-amber-800">
                      {t("auth.errors.session_timeout_desc")}
                    </p>
                  </div>
                </div>
              </div>
            )}
            {/* <div className="mb-6 rounded-2xl border border-emerald-700/20 bg-emerald-900/[0.05] p-5 shadow-sm">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-900/10 text-emerald-700">
                    <ShieldCheck className="h-4.5 w-4.5" />
                  </div>

                  <h3 className="text-sm font-semibold text-emerald-900">
                    {isRtl
                      ? "نعمل حالياً على تعزيز أمان الحسابات"
                      : "We’re enhancing account security"}
                  </h3>
                </div>

                <div className="text-[11px] sm:text-xs md:text-sm leading-6 text-emerald-800 space-y-2">
                  <p>
                    {isRtl
                      ? "نعمل حالياً على تطوير مستوى الحماية والأمان في المنصة لتوفير تجربة أكثر أماناً وموثوقية لجميع المستخدمين."
                      : "We are currently improving our platform’s security measures to provide a safer and more secure experience for all users."}
                  </p>

                  <p>
                    {isRtl
                      ? "إذا واجهت أي مشكلة في تسجيل الدخول أو الوصول إلى حسابك، فلا داعي للقلق. تواصل معنا مباشرة وسيساعدك فريق الدعم بأسرع وقت."
                      : "If you experience any issue while signing in or accessing your account, there is no need to worry. Please contact us and our support team will assist you as quickly as possible."}
                  </p>
                </div>
              </div>
            </div> */}
            {/* Mode Switch */}
            {mode !== "forgot-password" && mode !== "reset-password" && (
              <div className="flex bg-muted rounded-xl p-1 mb-6">
                {(["login", "register"] as const).map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setMode(tab)}
                    className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                      mode === tab
                        ? "bg-[#988662] shadow text-white"
                        : "text-jadwa-muted"
                    }`}
                  >
                    {tab === "login" ? t("auth.sign_in") : t("auth.register")}
                  </button>
                ))}
              </div>
            )}

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={(e) => {
                  if (mode === "register" && !approveTerms) {
                    e.preventDefault();
                    setTermsError(true);

                    // remove error after animation
                    setTimeout(() => setTermsError(false), 600);
                    return;
                  }

                  handleSubmit(e);
                }}
                className="space-y-3"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {(mode === "forgot-password" || mode === "reset-password") && (
                  <div className="space-y-5">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => {
                          setMode("login");
                          setOtp("");
                          setNewPassword("");
                          setResetEmail("");
                        }}
                        className="flex items-center text-sm text-muted-foreground transition hover:text-foreground"
                      >
                        {isRtl ? (
                          <ArrowRightCircle className="me-2 h-5 w-5" />
                        ) : (
                          <ArrowLeftCircle className="me-2 h-5 w-5" />
                        )}
                        {t("common.back")}
                      </button>

                      <h2 className="border-b-2 border-primary pb-1 text-lg font-bold text-jadwa">
                        {t("auth.reset_acc_pass")}
                      </h2>
                    </div>

                    {mode === "reset-password" && (
                      <div className="rounded-xl border border-primary/15 bg-primary/5 p-5 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                            <Mail className="h-6 w-6 text-primary" />
                          </div>

                          <div className="flex flex-col">
                            <h3 className="text-base font-semibold">
                              {t("auth.enter_verification_code")}
                            </h3>

                            <p className="mt-2 text-sm text-muted-foreground">
                              {t("auth.code_sent_to")}
                            </p>
                          </div>
                        </div>

                        <div className="mt-3 inline-flex rounded-full border bg-background px-4 py-2">
                          <span className="font-medium tracking-wide">
                            {maskEmail(resetEmail)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                {/* Full Name */}
                {mode === "register" && (
                  <Field
                    label={t("auth.full_name")}
                    icon={<User />}
                    value={formData.fullName}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, fullName: v }))
                    }
                  />
                )}

                {/* Phone */}
                {mode !== "reset-password" && mode !== "forgot-password" && (
                  <div>
                    <label className="text-xs font-medium text-jadwa-muted mb-1 block">
                      {t("auth.phone_number")}
                    </label>
                    <PhoneInput
                      countries={COUNTRIES}
                      country={formData.country}
                      phone={formData.phone}
                      isRtl={isRtl}
                      isMobile={isMobile}
                      onCountryChange={(c) =>
                        setFormData((p) => ({
                          ...p,
                          country: c.code,
                          dialCode: c.dialCode,
                        }))
                      }
                      onPhoneChange={(phone) =>
                        setFormData((p) => ({ ...p, phone }))
                      }
                    />

                    {(showWarn || showLengthError) && (
                      <p className="text-xs text-destructive mt-1">
                        {showWarn
                          ? t("auth.errors.only_numbers")
                          : t("auth.errors.phone_length")}
                      </p>
                    )}
                  </div>
                )}

                {mode === "forgot-password" && (
                  <Field
                    label={t("auth.email")}
                    icon={<AtSign />}
                    value={resetEmail}
                    onChange={(v) => setResetEmail(v)}
                  />
                )}

                {/* Password */}
                {mode === "register" && (
                  <PasswordField
                    label={t("auth.pin_code")}
                    value={formData.pinCode}
                    show={showPin}
                    toggle={() => setShowPassword((v) => !v)}
                    onChange={(v) => setFormData((p) => ({ ...p, pinCode: v }))}
                    isRtl={isRtl}
                    hint={t("auth.pin_hint")}
                  />
                )}
                {mode === "login" && (
                  <PasswordField
                    label={t("auth.pin_code")}
                    value={formData.pinCode}
                    show={showPin}
                    toggle={() => setShowPin((v) => !v)}
                    onChange={(v) => setFormData((p) => ({ ...p, pinCode: v }))}
                    isRtl={isRtl}
                    numericOnly
                    maxLength={6}
                    hint={t("auth.pin_hint")}
                  />
                )}
                {mode === "reset-password" && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium text-jadwa-muted">
                      {t("auth.verification_code")}
                    </label>

                    <OtpInput value={otp} onChange={setOtp} />
                  </div>
                )}
                {mode === "reset-password" && (
                  <>
                    <PasswordField
                      label={t("auth.new_password")}
                      value={newPassword}
                      show={showPassword}
                      toggle={() => setShowPassword((v) => !v)}
                      onChange={setNewPassword}
                      isRtl={isRtl}
                    />
                    <PasswordField
                      label={t("auth.confirm_new_password")}
                      value={confirmNewPassword}
                      show={showPassword}
                      toggle={() => setShowPassword((v) => !v)}
                      onChange={setConfirmNewPassword}
                      isRtl={isRtl}
                    />
                  </>
                )}

                {mode === "login" && (
                  <button
                    type="button"
                    onClick={() => setMode("forgot-password")}
                    className="text-sm text-jadwa hover:underline"
                  >
                    {t("auth.forgot_password")}
                  </button>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-[#988662]"
                  disabled={
                    isLoading ||
                    (mode === "reset-password" &&
                      newPassword !== confirmNewPassword)
                  }
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      {
                        {
                          login: t("auth.sign_in"),
                          register: t("auth.register"),
                          "forgot-password": t("auth.send_code"),
                          "reset-password": t("common.confirm"),
                        }[mode]
                      }
                    </>
                  )}
                </Button>
              </motion.form>
            </AnimatePresence>
          </div>

          {mode === "register" && (
            <motion.div
              animate={termsError ? { x: [-3, 3, -2, 2, 0] } : { x: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className={cn(
                "mt-4 rounded-xl p-3 border transition-colors",
                "relative",
                termsError
                  ? "bg-destructive/10 border-destructive"
                  : "bg-muted/30 border-border/40",
              )}
            >
              {/* Left accent bar */}
              {termsError && (
                <span className="absolute inset-y-2 left-1 w-1 rounded-full bg-destructive" />
              )}

              <div className="flex items-start gap-3 ps-2">
                <input
                  type="checkbox"
                  id="approveTerms"
                  checked={approveTerms}
                  onChange={(e) => {
                    setApproveTerms(e.target.checked);
                    setTermsError(false);
                  }}
                  className="mt-[3px] h-4 w-4 accent-primary"
                />

                <label
                  htmlFor="approveTerms"
                  className="text-[12px] leading-5 text-foreground/80"
                >
                  <span>{t("auth.accept_terms")}</span>{" "}
                  <button
                    type="button"
                    onClick={() => setOpenTerms(true)}
                    className="underline font-medium text-foreground hover:opacity-80 transition"
                  >
                    {t("auth.terms_link")}
                  </button>
                </label>
              </div>

              {termsError && (
                <p className="mt-1 ps-7 text-[11px] font-medium text-destructive">
                  {t("auth.terms_required")}
                </p>
              )}
            </motion.div>
          )}
        </motion.div>
        <PlatformTermsModal
          isOpen={openTerms}
          onClose={() => setOpenTerms(false)}
        />
        <a
          href="https://wa.me/963965886012"
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isRtl ? "تواصل معنا" : "Contact us"}
          className={cn(
            "fixed bottom-5 z-50 inline-flex items-center gap-2 rounded-full shadow-lg",
            "bg-emerald-600 px-4 py-3 text-white transition hover:bg-emerald-700 hover:shadow-xl",
            isRtl ? "left-4 sm:left-6" : "right-4 sm:right-6",
          )}
        >
          <MessageCircleMore className="h-5 w-5" />
          <span className="text-sm font-semibold">
            {isRtl ? "تواصل معنا" : "Contact Us"}
          </span>
        </a>
      </div>
    </div>
  );
};

export default Auth;
