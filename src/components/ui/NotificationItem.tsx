import { X } from "lucide-react";
import { Notification } from "@/interfaces/Notification";
import { useTranslation } from "react-i18next";

interface Props {
  notification: Notification;
  onRead: () => void;
}

export function NotificationItem({ notification, onRead }: Props) {
  const { t } = useTranslation();

  return (
    <div className="group flex gap-3 px-4 py-3 border-b hover:bg-muted/40 transition text-start">
      {/* Icon (type-based later if you want) */}
      <div className="mt-1 h-2 w-2 rounded-full bg-primary" />

      <div className="flex-1">
        <p className="text-sm font-medium">
          {t(`notifications.types.${notification?.title.toLowerCase()}`)}
        </p>

        {notification?.message && (
          <p className="text-xs text-muted-foreground mt-0.5">
            {t(`notifications.types.${notification?.message.toLowerCase()}`)}
          </p>
        )}

        <p className="text-[10px] text-muted-foreground mt-1">
          {new Date(notification?.createdAt).toLocaleString()}
        </p>
      </div>

      {/* Mark as read */}
      <button
        onClick={onRead}
        className="opacity-0 opacity-100 transition"
        title="Mark as read"
      >
        <X className="h-4 w-4 text-foreground" />
      </button>
    </div>
  );
}
