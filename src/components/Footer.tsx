import { motion } from "framer-motion";
import { User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";

export const Footer = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const path = location.pathname;

  return (
    <motion.header
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      className="sticky bottom-0 z-40 w-full border-b border-border/50 bg-white/80 backdrop-blur-xl md:hidden"
    >
      <nav className="flex items-center justify-around">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/")}
          className={`gap-2 ${path === "/" ? "" : "text-muted-foreground"}`}
        >
          <Home className="w-4 h-4" />
          <span className="hidden sm:inline">Home</span>
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate("/profile")}
          className={`gap-2 ${
            path === "/profile" ? "" : "text-muted-foreground"
          }`}
        >
          <User className="w-4 h-4" />
          <span className="hidden sm:inline">Profile</span>
        </Button>
      </nav>
    </motion.header>
  );
};
