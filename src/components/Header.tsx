import { motion } from "framer-motion";
import { LogOut, TrendingUp, User, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { UserData } from "@/store/api/authApi";
import { useState } from "react";

export const Header = () => {
  const [user] = useState<UserData>(
    JSON.parse(localStorage.getItem("user") || "null")
  );

  const { logout } = useAuth();
  const navigate = useNavigate();

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
        <div className="flex items-center gap-6">
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-lg shadow-primary/20">
              <TrendingUp className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold gradient-text">StockFlow</span>
          </div>

          {/* Navigation */}
          <nav className="hidden sm:flex items-center gap-1">
            <Button
              variant={path === "/" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate("/")}
              className="gap-2"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
            <Button
              variant={path === "/profile" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => navigate("/profile")}
              className="gap-2"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <span>{user?.fullName || "User"}</span>
          </div>
          {/* Desktop: Logout */}
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="hidden md:flex text-muted-foreground hover:text-destructive"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>

          {/* Mobile: Profile */}
          {path.includes("profile") ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/")}
              className="flex md:hidden text-muted-foreground"
            >
              <Home className="w-4 h-4" />
              Home
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/profile")}
              className="flex md:hidden text-muted-foreground"
            >
              <User className="w-4 h-4" />
              Profile
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};
