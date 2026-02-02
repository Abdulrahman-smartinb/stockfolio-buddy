import { motion } from "framer-motion";
import { LogOut, User, Home, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { isLoggedIn } from "@/hooks/helpers";
import logo from "../../public/jadwa.webp";

export const Header = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const loggedIn = isLoggedIn();

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
          <div className="w-10 h-10 rounded-xl flex items-center justify-center">
            <img src={logo} alt="Jadwa Logo" />
          </div>
          <span className="text-lg font-bold gradient-text sm:block">
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
            onClick={() =>
              loggedIn ? navigate("/profile") : navigate("/auth")
            }
            className="gap-2"
          >
            <User className="w-4 h-4" />
            <span className="hidden sm:inline">{t("profile")}</span>
          </Button>
        </nav>

        {/* RIGHT — User Actions */}
        <div className="flex items-center gap-3">
          {/* Language selector */}
          <div className="relative">
            <select
              value={(i18n.language || "").split("-")[0] || "en"}
              onChange={(e) => i18n.changeLanguage(e.target.value)}
              aria-label="Language"
              className="appearance-none rounded-lg border border-border/60 bg-background/60
      pl-9 pr-8 py-1.5 text-sm font-medium backdrop-blur-md shadow-sm transition
      hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="en">{t("en")}</option>
              <option value="ar">{t("ar")}</option>
            </select>

            {/* Globe icon */}
            <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground">
              {i18n.language === "ar" ? "🇸🇾" : "🇬🇧"}
            </span>
          </div>

          {/* Logout */}
          {loggedIn ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className={cn(
                "text-muted-foreground hover:text-destructive",
                "flex items-center gap-2",
              )}
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden md:inline">{t("logout")}</span>
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/auth")}
              className={cn(
                "text-muted-foreground hover:text-white",
                "flex items-center gap-2",
              )}
            >
              <LogIn className="w-4 h-4" />
              <span className="hidden md:inline">{t("login_register")}</span>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};
