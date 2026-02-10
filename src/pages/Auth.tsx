import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, Eye, EyeOff, Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";
import { PhoneInput } from "@/components/PhoneInput";
import { isMobile } from "@/hooks/helpers";
import { cn } from "@/lib/utils";
import logoAR from "../assets/images/JadwaAR.png";
import logoEN from "../assets/images/JadwaEN.png";
import { PlatformTermsModal } from "@/components/PlatformTermsModal";

const PRIMARY = "#072522";

const Auth = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";

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
              <img
                src={isRtl ? logoAR : logoEN}
                alt="Jadwa"
                className="w-full"
              />
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
              <span style={{ color: PRIMARY }}>{t("home.headline_2")}</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-md">
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
            {/* <img src={logo} alt="Jadwa" className="w-10 h-10" />
            <span className="text-xl font-bold" style={{ color: PRIMARY }}>
              Jadwa Invest
            </span> */}
            <img
              src={isRtl ? logoAR : logoEN}
              alt="Jadwa Logo"
              className="w-[73%]"
            />
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-6 sm:p-8 shadow-sm">
            {/* Mode Switch */}
            <div className="flex bg-muted rounded-xl p-1 mb-6">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMode(tab)}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold transition ${
                    mode === tab
                      ? "bg-white shadow text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab === "login" ? t("auth.sign_in") : t("auth.register")}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                onSubmit={/*isPinRequired ? verifyPin :*/ handleSubmit}
                className="space-y-4"
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
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
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

                {/* Submit */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || (mode === "register" && !approveTerms)}
                  style={{ backgroundColor: PRIMARY }}
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
            <div className="mt-4">
              <div className="flex items-start gap-2">
                {/* Checkbox */}
                <input
                  type="checkbox"
                  id="approveTerms"
                  checked={approveTerms}
                  onChange={(e) => setApproveTerms(e.target.checked)}
                  className="mt-[3px] h-4 w-4 accent-primary"
                />

                {/* Text */}
                <label
                  htmlFor="approveTerms"
                  className="text-[12px] text-muted-foreground leading-5"
                >
                  <span>{t("auth.accept_terms")}</span>{" "}
                  <button
                    type="button"
                    onClick={() => setOpenTerms(true)}
                    className="underline font-medium hover:text-foreground transition"
                  >
                    {t("auth.terms_link")}
                  </button>
                </label>
              </div>

              {/* Helper text */}
              {!approveTerms && (
                <p className="mt-1 ms-6 text-[11px] text-muted-foreground">
                  {t("auth.terms_required")}
                </p>
              )}
            </div>
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

/* ================= Small Helpers ================= */

const Field = ({ label, icon, value, onChange }: any) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1 block">
      {label}
    </label>
    <div className="relative">
      <span className="absolute ms-3 top-1/2 -translate-y-1/2 text-muted-foreground">
        {icon}
      </span>
      <Input
        className="ps-10 h-11"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  </div>
);

const PasswordField = ({
  label,
  value,
  show,
  toggle,
  onChange,
  isRtl,
  hint,
  numericOnly = false,
  maxLength,
}: any) => (
  <div>
    <label className="text-xs font-medium text-muted-foreground mb-1 block">
      {label}
    </label>

    <div className="relative">
      <Lock className="absolute ms-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
      <Input
        type={show ? "text" : "password"}
        inputMode={numericOnly ? "numeric" : "text"}
        pattern={numericOnly ? "[0-9]*" : undefined}
        maxLength={maxLength}
        className="ps-10 pr-10 h-11"
        value={value}
        onChange={(e) => {
          const val = numericOnly
            ? e.target.value.replace(/\D/g, "")
            : e.target.value;
          onChange(val);
        }}
      />

      <button
        type="button"
        onClick={toggle}
        className={cn(
          "absolute top-1/2 -translate-y-1/2 text-muted-foreground",
          isRtl ? "left-3" : "right-3"
        )}
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>

    {hint && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
  </div>
);

const LanguageSwitch = () => {
  const { i18n } = useTranslation();
  const isAr = i18n.language === "ar";

  return (
    <button
      onClick={() => i18n.changeLanguage(isAr ? "en" : "ar")}
      className="
        flex items-center gap-2
        text-xs font-semibold
        px-3 py-1.5 rounded-full
        border border-border/60
        bg-background/70 backdrop-blur
        hover:bg-muted/40
        transition
      "
      aria-label="Change language"
    >
      <span>{isAr ? "العربية" : "English"}</span>
      {isAr ? <Undo2 /> : <Redo2 />}

      <span className="opacity-80">{isAr ? "English" : "العربية"}</span>
    </button>
  );
};
