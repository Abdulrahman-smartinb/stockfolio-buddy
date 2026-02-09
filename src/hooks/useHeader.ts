import { useAuth } from "@/hooks/useAuth";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  useGetMyNotificationsQuery,
  useMarkAllAsReadMutation,
  useMarkAsReadMutation,
} from "@/store/api/utils/notificationApi";
import { useState } from "react";
import Cookies from "js-cookie";

const useHeader = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const path = location.pathname;
  const userObj = JSON.parse(Cookies.get("profile"));

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
  };
};
export default useHeader;
