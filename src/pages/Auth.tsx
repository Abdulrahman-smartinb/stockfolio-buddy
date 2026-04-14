import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
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

const Auth = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const [searchParams] = useSearchParams();
  const reason = searchParams.get("reason");

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
              {/* <h1
                className="text-4xl font-extrabold tracking-tight"
                style={{ color: PRIMARY }}
              >
                Jadwa Invest
              </h1> */}
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
            {/* Mode Switch */}
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

                {/* Password */}
                {mode === "register" && (
                  <PasswordField
                    label={t("auth.password")}
                    value={formData.password}
                    show={showPassword}
                    toggle={() => setShowPassword((v) => !v)}
                    onChange={(v) =>
                      setFormData((p) => ({ ...p, password: v }))
                    }
                    isRtl={isRtl}
                    hint={t("auth.password_hint")}
                  />
                )}
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

                {/* PIN */}
                {/*isPinRequired && (
                  <PasswordField
                    label={t("auth.pin_code")}
                    value={pinCode}
                    show={showPin}
                    toggle={() => setShowPin((v) => !v)}
                    onChange={setPinCode}
                    isRtl={isRtl}
                  />
                )*/}
                {mode === "login" && (
                  <p className="text-sm cursor-pointer text-jadwa">
                    {t("auth.forgot_password")}
                  </p>
                )}

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full bg-primary hover:bg-[#988662]"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      {mode === "login"
                        ? t("auth.sign_in")
                        : t("auth.register")}
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
      </div>
    </div>
  );
};

export default Auth;
