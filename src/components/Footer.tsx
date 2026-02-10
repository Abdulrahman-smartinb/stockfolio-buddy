import { motion } from "framer-motion";
import { Home, ArrowLeftRight, Settings } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const items = [
    {
      key: "activity",
      label: t("nav.transactions"),
      icon: ArrowLeftRight,
      path: "/investorActivity",
    },
    {
      key: "home",
      label: t("nav.home"),
      icon: Home,
      path: "/",
    },
    {
      key: "settings",
      label: t("nav.settings"),
      icon: Settings,
      path: "/Settings",
    },
  ];

  return (
    <motion.footer
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="
        fixed bottom-0 z-40 w-full md:hidden
        border-t border-border/60
        bg-background/80 backdrop-blur-xl
      "
    >
      <nav className="flex h-16 items-center justify-around">
        {items.map(({ key, label, icon: Icon, path }) => {
          const active = pathname === path;

          return (
            <button
              key={key}
              onClick={() => navigate(path)}
              className={cn(
                "flex flex-col items-center justify-center gap-1",
                "w-full h-full",
                "transition-all duration-200",
                "text-xs font-medium",
                active
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon
                className={cn(
                  "h-6 w-6 transition-transform duration-200",
                  active && "scale-110"
                )}
              />
              <span className="leading-none">{label}</span>

              {/* Active indicator */}
              {active && (
                <span className="mt-1 h-[2px] w-6 rounded-full bg-primary" />
              )}
            </button>
          );
        })}
      </nav>
    </motion.footer>
  );
};
