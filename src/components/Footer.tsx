import { motion } from "framer-motion";
import {
  User,
  Home,
  ChartBar,
  ChartArea,
  ArrowLeftRight,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const Footer = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  return (
    <motion.header
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      style={{ boxShadow: "0 -2px rgb(0 0 0 / 0.05)" }}
      className="fixed bottom-0 z-40 w-full border-b border-border/50 bg-white/80 backdrop-blur-xl md:hidden"
    >
      <nav className="flex items-center justify-around h-14">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/investorActivity")}
          className={`gap-2 w-[48%] ${
            path === "/investorActivity" ? "" : "text-muted-foreground"
          }`}
        >
          <ArrowLeftRight style={{ height: "25px", width: "25px" }} />
          <span className="hidden sm:inline">{t("profile")}</span>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className={`gap-2 w-[48%] ${
            path === "/" ? "" : "text-muted-foreground"
          }`}
        >
          <Home style={{ height: "25px", width: "25px" }} />
          <span className="hidden sm:inline">{t("home")}</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/Settings")}
          className={`gap-2 w-[48%] ${
            path === "/Settings" ? "" : "text-muted-foreground"
          }`}
        >
          <Settings style={{ height: "25px", width: "25px" }} />
          <span className="hidden sm:inline">{t("settings")}</span>
        </Button>
      </nav>
    </motion.header>
  );
};
