import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

const Auth = () => {
  const { t, i18n } = useTranslation();
  const isRtl = i18n.language === "ar";
  const {
    mode,
    setMode,
    showPassword,
    setShowPassword,
    formData,
    setFormData,
    isLoading,
    handleSubmit,
    handlePhoneNumberChange,
    showWarn,
    showLengthError,
  } = useAuth();

  return (
    <div
      className="min-h-screen bg-background flex"
      dir={isRtl ? "rtl" : "ltr"}
    >
      {/* LEFT – DESKTOP ONLY */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-accent/10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,hsl(var(--primary)/0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,hsl(var(--accent)/0.15),transparent_50%)]" />

        <div className="relative z-10 flex flex-col justify-center px-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-xl">
                <TrendingUp className="w-7 h-7 text-primary-foreground" />
              </div>
              <h1 className="text-4xl font-bold gradient-text">Jadwa Invest</h1>
            </div>

            <h2 className="text-4xl font-bold mb-4">
              {t("trade_smarter")}
              <br />
              <span className="gradient-text">{t("grow_faster")}</span>
            </h2>

            <p className="text-lg text-muted-foreground max-w-md">
              {t("login_letter")}
            </p>
          </motion.div>
        </div>
      </div>

      {/* RIGHT – AUTH FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          {/* MOBILE LOGO */}
          <div className="lg:hidden flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">
              Jadwa Invest
            </span>
          </div>

          <div className="glass-card rounded-2xl p-5 sm:p-8">
            {/* MODE SWITCH */}
            <div className="flex bg-muted rounded-xl p-1 mb-6">
              {(["login", "register"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setMode(tab)}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition ${
                    mode === tab
                      ? "bg-background shadow text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {tab === "login" ? t("sign_in") : t("register")}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.form
                key={mode}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
                onSubmit={handleSubmit}
              >
                {/* FULL NAME */}
                {mode === "register" && (
                  <div>
                    <label className="text-xs font-medium text-muted-foreground mb-1 block">
                      {t("full_name")}
                    </label>
                    <div className="relative">
                      <User
                        className={`absolute ${
                          isRtl ? "right" : "left"
                        }-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`}
                      />
                      <Input
                        className="ps-10 h-11"
                        value={formData.fullName}
                        onChange={(e) =>
                          setFormData({ ...formData, fullName: e.target.value })
                        }
                        required
                      />
                    </div>
                  </div>
                )}

                {/* PHONE */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t("phone_number")}
                  </label>
                  <div className="relative">
                    <Phone
                      className={`absolute ${
                        isRtl ? "right" : "left"
                      }-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`}
                    />
                    <Input
                      type="tel"
                      className={`ps-10 h-11 ${
                        showWarn || showLengthError ? "border-red-500" : ""
                      }`}
                      value={formData.phoneNumber}
                      onChange={handlePhoneNumberChange}
                      placeholder="905**********"
                      required
                    />
                  </div>

                  {(showWarn || showLengthError) && (
                    <p className="text-xs text-red-500 mt-1 leading-tight">
                      {showWarn ? t("only_numbers") : t("phone_length")}
                    </p>
                  )}
                </div>

                {/* PASSWORD */}
                <div>
                  <label className="text-xs font-medium text-muted-foreground mb-1 block">
                    {t("password")}
                  </label>
                  <div className="relative">
                    <Lock
                      className={`absolute ${
                        isRtl ? "right" : "left"
                      }-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground`}
                    />
                    <Input
                      type={showPassword ? "text" : "password"}
                      className="ps-10 pr-10 h-11"
                      value={formData.password}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          password: e.target.value,
                        })
                      }
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className={`absolute ${
                        isRtl ? "left" : "right"
                      }-3 top-1/2 -translate-y-1/2 text-muted-foreground`}
                    >
                      {showPassword ? (
                        <EyeOff className="w-4 h-4" />
                      ) : (
                        <Eye className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* SUBMIT */}
                <Button
                  type="submit"
                  size="lg"
                  className="w-full mt-2"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1 }}
                      className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full"
                    />
                  ) : (
                    <>
                      {mode === "login" ? t("sign_in") : t("register")}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              </motion.form>
            </AnimatePresence>
          </div>

          <p className="text-[11px] text-muted-foreground text-center mt-4">
            {t("terms_policy_agree")}
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Auth;
