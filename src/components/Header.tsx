import { motion } from "framer-motion";
import {
  User,
  Home,
  Bell,
  Settings,
  ArrowLeftRight,
  Globe,
  ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import logo from "../assets/images/investment-logo-large.png";
import avatar from "../assets/images/user.png";
import useHeader from "@/hooks/useHeader";
import { NotificationItem } from "./ui/NotificationItem";
import { isMobile } from "@/hooks/helpers";
import { base_url } from "@/api/GlobalData";
import { useProfile } from "@/hooks/useProfile";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";

export const Header = () => {
  const {
    navigate,
    t,
    i18n,
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
  } = useHeader();

  const { user } = useProfile();
  const location = useLocation();
  const isRtl = i18n.language === "ar";
  const isProjectDetailsMobile =
    isMobile && /^\/project-details\/[^/]+$/.test(location.pathname);
  const notifButtonRef = useRef<HTMLButtonElement | null>(null);
  const notifPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      // if click is NOT on bell AND NOT inside notification panel
      if (
        notifPanelRef.current &&
        !notifPanelRef.current.contains(target) &&
        notifButtonRef.current &&
        !notifButtonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open, setOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "sticky top-0 z-40 w-full",
        "border-b border-border/60",
        "bg-background/70 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60",
      )}
    >
      <div className="container mx-auto px-4">
        <div className="h-16 flex items-center justify-between">
          {/* LEFT — Brand */}
          <div
            className={cn(
              "flex items-center gap-3 cursor-pointer select-none",
              "group",
            )}
            onClick={() => navigate("/")}
          >
            <div
              className={cn(
                "w-40 h-20 rounded-xl overflow-hidden",

                "transition group-hover:ring-primary/30",
              )}
            >
              <img
                src={logo}
                alt="Jadwa Logo"
                className="w-full h-full object-contain"
              />
            </div>

            {/* Brand text */}
            {/* <div className="leading-none">
              <div className="flex items-baseline ">
                <span className="text-[15px] sm:text-base font-extrabold tracking-tight text-pr mx-1 uppercase">
                  {t("brand.jadwa")}
                </span>
                <span className="text-[11px] sm:text-xs font-semibold tracking-wide text-muted-pr px-0 mx-0 uppercase">
                  {t("brand.invest")}
                </span>
              </div>
              <div className="text-[11px] text-jadwa-muted/80 hidden sm:block">
                {t("brand.share_market")}
              </div>
            </div> */}
          </div>

          {/* CENTER — Navigation */}
          <nav className="hidden md:flex items-center gap-1 rounded-2xl bg-muted/40 p-1">
            {[
              { path: "/", label: t("nav.home"), icon: Home },
              { path: "/profile", label: t("nav.profile"), icon: User },
              { path: "/settings", label: t("nav.settings"), icon: Settings },
              {
                path: "/investorActivity",
                label: t("nav.transactions"),
                icon: ArrowLeftRight,
              },
            ].map(({ path: target, label, icon: Icon }) => {
              const active = path === target;

              return (
                <button
                  key={target}
                  onClick={() => navigate(target)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium",
                    "transition-all duration-200",
                    active
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-jadwa-muted hover:bg-muted/60 hover:text-foreground",
                  )}
                >
                  <Icon
                    className={`w-4 h-4 ${active ? "jadwa-icon-brown" : "jadwa-icon-gold"}`}
                  />
                  <span
                    className={`hidden lg:inline ${active ? "text-[#FFF]" : "text-[#3F3B38]"}`}
                  >
                    {label}
                  </span>
                </button>
              );
            })}

            {/* Language Toggle */}
            <button
              onClick={() =>
                i18n.changeLanguage(i18n.language === "en" ? "ar" : "en")
              }
              className={cn(
                "flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200",
                "text-jadwa-muted hover:bg-muted/60 hover:text-foreground",
              )}
            >
              <Globe className="w-4 h-4 jadwa-icon-gold" />

              <span className="hidden lg:inline pt-0.5 text-[#3F3B38]">
                {!isRtl ? "English" : "العربية"}
              </span>
            </button>
          </nav>

          {/* RIGHT — User Actions */}
          <div className="flex items-center gap-3">
            {/* Notifications + Avatar */}
            <div className="flex items-center gap-3">
              {/* Notifications */}
              <div className="relative">
                <button
                  ref={notifButtonRef}
                  onClick={() => setOpen((prev) => !prev)}
                  className={cn(
                    "relative inline-flex items-center justify-center",
                    "h-9 w-9 rounded-xl",
                    "ring-1 ring-border/60",
                    "bg-background/40",
                    "hover:bg-muted/60 hover:ring-primary/30",
                    "transition",
                  )}
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5 jadwa-icon-gold" />

                  {unreadCount > 0 && (
                    <span
                      className={cn(
                        "absolute -top-1 -right-1",
                        "flex h-4 min-w-4 px-1 items-center justify-center",
                        "rounded-full bg-destructive text-[10px] font-bold text-white",
                        "ring-2 ring-background",
                      )}
                    >
                      {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                  )}
                </button>

                {open && (
                  <div
                    ref={notifPanelRef}
                    className={cn(
                      "absolute mt-3 z-50 max-w-[calc(100vw-5rem)]",
                      !isRtl ? "right-0" : "left-0",
                      "rounded-2xl border border-border bg-background shadow-xl",
                      "overflow-hidden",
                      isMobile
                        ? "w-[min(20rem,calc(100vw-2rem))]"
                        : "w-[24rem]",
                    )}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/20">
                      <span className="text-sm font-semibold">
                        {`${t("notifications.title")} (${unreadCount})`}
                      </span>

                      {unreadCount > 0 && (
                        <button
                          onClick={() => {
                            markAllAsRead({ authUserId: userObj.authUserId })
                              .unwrap()
                              .then(() => refetch());
                          }}
                          className="text-xs font-semibold text-primary hover:underline"
                        >
                          {t("notifications.mark_all_read")}
                        </button>
                      )}
                    </div>

                    {/* List */}
                    <div className="max-h-96 overflow-y-auto">
                      {isLoading ? (
                        <div className="p-4 text-sm text-jadwa-muted">
                          {t("loading")}
                        </div>
                      ) : notifications.length === 0 ? (
                        <div className="p-4 text-sm text-jadwa-muted text-center">
                          {t("notifications.none")}
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

              {/* Avatar */}
              <button
                onClick={() => {
                  if (isProjectDetailsMobile) {
                    navigate(location.state?.from || "/", {
                      replace: true,
                      state: {
                        restoreScrollY: location.state?.restoreScrollY ?? 0,
                      },
                    });
                    return;
                  }

                  navigate("/profile");
                }}
                className={cn(
                  "inline-flex items-center justify-center",
                  "h-9 w-9 rounded-xl",
                  "ring-1 ring-border/60",
                  "bg-background/40",
                  "hover:ring-primary/30",
                  "transition",
                  "focus:outline-none focus:ring-2 focus:ring-primary/30",
                )}
                aria-label={isProjectDetailsMobile ? "Back" : "Profile"}
              >
                {isProjectDetailsMobile ? (
                  <ArrowLeft
                    className={cn(
                      "h-5 w-5 jadwa-icon-gold",
                      isRtl && "rotate-180",
                    )}
                  />
                ) : (
                  <img
                    src={
                      user?.profileImage
                        ? `${base_url}/Investor/${user.profileImage}`
                        : avatar
                    }
                    alt="User Avatar"
                    className="h-8 w-8 rounded-lg object-cover"
                  />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.header>
  );
};

{
}
