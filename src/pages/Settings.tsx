import { Globe, Moon, Bell, LogOut, User, RefreshCcw } from "lucide-react";
import { Header } from "@/components/Header";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Footer } from "@/components/Footer";

/* ================= Page ================= */

const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isRtl = i18n.language === "ar";

  return (
    <div className="min-h-screen bg-background" dir={isRtl ? "rtl" : "ltr"}>
      <Header />

      <main className="container mx-auto px-4 py-5 space-y-6">
        {/* Account */}
        <Section title={t("settings.account_settings")}>
          <SettingRow
            icon={<User className="w-5 h-5 jadwa-icon-gold" />}
            label={t("settings.profile")}
            onClick={() => navigate("/profile")}
          />
        </Section>

        {/* Preferences */}
        <Section title={t("settings.preferences")}>
          <SettingRow
            icon={<Globe className="w-5 h-5 jadwa-icon-gold" />}
            label={t("settings.language")}
            right={
              <button
                onClick={() =>
                  i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")
                }
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
                {i18n.language === "en" ? (
                  <span className="font-google">English</span>
                ) : (
                  <span className="font-tajawal pt-0.5">العربية</span>
                )}
                <RefreshCcw className="w-4 h-4 mx-2 jadwa-icon-gold" />
                {i18n.language === "en" ? (
                  <span className="font-tajawal pt-0.5"> العربية </span>
                ) : (
                  <span className="font-google"> English </span>
                )}
              </button>
            }
          />

          <SettingRow
            icon={<Moon className="w-5 h-5 jadwa-icon-gold" />}
            label={t("settings.theme")}
            right={
              <span className="text-sm text-jadwa-muted">
                {t("settings.system")}
              </span>
            }
          />
        </Section>

        {/* Notifications */}
        <Section title={t("settings.notifications")}>
          <SettingRow
            icon={<Bell className="w-5 h-5 jadwa-icon-gold" />}
            label={t("settings.notifications")}
            right={<Toggle />}
          />
        </Section>

        {/* Danger */}
        <Section>
          <SettingRow
            icon={<LogOut className="w-5 h-5 jadwa-icon-gold" />}
            label={t("settings.logout")}
            danger
            onClick={logout}
          />
        </Section>
      </main>
      <Footer />
    </div>
  );
};

export default Settings;

export const Section = ({
  title,
  children,
}: {
  title?: string;
  children: React.ReactNode;
}) => (
  <div className="space-y-2">
    {title && (
      <h3 className="text-xs font-semibold uppercase text-jadwa-muted px-1">
        {title}
      </h3>
    )}
    <div className="rounded-2xl border border-border/60 bg-white shadow-sm divide-y">
      {children}
    </div>
  </div>
);

type SettingRowProps = {
  icon: React.ReactNode;
  label: string;
  danger?: boolean;
  onClick?: () => void;
  right?: React.ReactNode;
};

const SettingRow = ({
  icon,
  label,
  danger,
  onClick,
  right,
}: SettingRowProps) => {
  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : -1}
      className={cn(
        "flex items-center justify-between",
        "px-4 py-3",
        "transition",
        onClick && "cursor-pointer hover:bg-muted/40 active:scale-[0.99]",
        danger && "hover:bg-destructive/10",
      )}
    >
      <div className="flex items-center gap-3">
        {icon}
        <span
          className={cn(
            "text-sm font-medium",
            danger ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </span>
      </div>

      {right && <div onClick={(e) => e.stopPropagation()}>{right}</div>}
    </div>
  );
};

const Arrow = ({ isRtl }: { isRtl: boolean }) => (
  <span className={cn("opacity-40", isRtl ? "rotate-180" : "")}>→</span>
);
const Toggle = () => (
  <div className="w-10 h-6 bg-muted rounded-full relative">
    <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow" />
  </div>
);
