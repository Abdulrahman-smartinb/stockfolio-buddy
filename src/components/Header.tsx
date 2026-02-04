import { motion } from "framer-motion";
import { LogOut, User, Home, LogIn, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logo from "../../public/jadwa.png";
import useHeader from "@/hooks/useHeader";
import { NotificationItem } from "./ui/NotificationItem";

export const Header = () => {
  const {
    logout,
    navigate,
    t,
    i18n,
    loggedIn,
    path,
    notifications,
    isLoading,
    error,
    markAsRead,
    markAllAsRead,
    open,
    setOpen,
    unreadCount,
    userObj,
    refetch,
    isMobile,
  } = useHeader();

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
      px-3 py-1.5 text-sm font-medium backdrop-blur-md shadow-sm transition
      hover:border-primary/50 focus:outline-none focus:ring-2 focus:ring-primary/40"
            >
              <option value="en">🇬🇧</option>
              <option value="ar">🇸🇾</option>
            </select>
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
          <div className="relative">
            <button
              onClick={() => setOpen((prev) => !prev)}
              className="relative"
            >
              <Bell className="w-5 h-5" />

              {unreadCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center
        rounded-full bg-destructive text-[10px] text-white"
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {open && (
              <div
                className={`absolute ${i18n.language == "en" ? "right" : "left"}-1 mt-3 rounded-xl border border-border bg-background shadow-lg z-50 ${isMobile ? "w-92" : "w-96"}`}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b">
                  <span className="text-sm font-semibold">
                    {`Notifications (${unreadCount})`}
                  </span>

                  {unreadCount > 0 && (
                    <button
                      onClick={() => {
                        markAllAsRead({ authUserId: userObj.authUserId })
                          .unwrap()
                          .then(() => refetch());
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                {/* List */}
                <div className="max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-sm text-muted-foreground">
                      Loading...
                    </div>
                  ) : notifications.length === 0 ? (
                    <div className="p-4 text-sm text-muted-foreground text-center">
                      No new notifications
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <NotificationItem
                        key={n._id}
                        notification={n}
                        onRead={() => {
                          markAsRead({
                            id: n._id,
                            authUserId: userObj.authUserId,
                          }).then(() => refetch());
                        }}
                      />
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
