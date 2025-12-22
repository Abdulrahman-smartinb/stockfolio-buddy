import { motion } from "framer-motion";
import { LogOut, TrendingUp, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const path = location.pathname;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-xl"
    >
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* LEFT — Brand */}
        <div
          className="flex items-center gap-3 cursor-pointer"
          onClick={() => navigate("/")}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="text-lg font-bold gradient-text hidden sm:block">
            JADWA INVEST
          </span>
        </div>

        {/* CENTER — Navigation (icons on mobile, text on desktop) */}
        <nav className="flex items-center gap-1 hidden md:inline">
          <Button
            variant={path === "/" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/")}
            className="gap-2"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">{t("home")}</span>
          </Button>

          <Button
            variant={path === "/profile" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => navigate("/profile")}
            className="gap-2"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{t("profile")}</span>
          </Button>
        </nav>

        {/* RIGHT — User Actions */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <select
            value={(i18n.language || "").split("-")[0] || "en"}
            onChange={(e) => i18n.changeLanguage(e.target.value)}
            aria-label="Language"
            className="appearance-none rounded-lg border border-border/60
            bg-background/60 px-3 py-1.5 pr-8 text-sm font-medium text-foreground
            backdrop-blur-md shadow-sm transition hover:border-primary/50
            focus:outline-none focus:ring-2 focus:ring-primary/40 text-center"
          >
            <option value="en">{t("en")}</option>
            <option value="ar">{t("ar")}</option>
          </select>

          {/* Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className={cn(
              "text-muted-foreground hover:text-destructive",
              "flex items-center gap-2"
            )}
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">{t("logout")}</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};
