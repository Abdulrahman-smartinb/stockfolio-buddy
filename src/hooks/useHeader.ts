import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { isLoggedIn } from "@/hooks/helpers";
import {
  useGetMyNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/store/api/utils/notificationApi";
import { useState } from "react";

const useHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const loggedIn = isLoggedIn();
  const path = location.pathname;
  const userObj = JSON.parse(localStorage.getItem("profile"));
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);

  const {
    data: notifications = [],
    isLoading,
    error,
    refetch,
  } = useGetMyNotificationsQuery({
    id: userObj?.authUserId,
    isRead: "false",
  });
  const [markAsRead] = useMarkAsReadMutation();
  const [markAllAsRead] = useMarkAllAsReadMutation();

  const [open, setOpen] = useState(false);
  const unreadCount = notifications.length;

  return {
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
  };
};
export default useHeader;
