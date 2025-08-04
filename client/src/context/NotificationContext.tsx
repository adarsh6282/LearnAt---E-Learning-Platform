import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import userApi from "../services/userApiService";
import instructorApi from "../services/instructorApiService";
import adminApi from "../services/adminApiService";

export interface INotification {
  _id: string;
  receiverId: string;
  receiverModel: "User" | "Instructor" | "Admin";
  message: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
}

interface NotificationContextType {
  notifications: INotification[];
  unreadCount: number;
  loading: boolean;
  markAsRead: (notificationId: string) => Promise<void>;
  refreshNotifications: () => Promise<void>;
}

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationContext =
  createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const { authUser, role: userRole } = useAuth();
  const admin = useAdmin();

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);

  const { userId, role } = useMemo(() => {
    if (userRole === "User" && authUser?._id) {
      return { userId: authUser._id, role: "users" as const };
    } else if (userRole === "Instructor" && authUser?._id) {
      return { userId: authUser._id, role: "instructors" as const };
    } else if (admin.id) {
      return { userId: admin.id, role: "admin" as const };
    }
    return { userId: null, role: null };
  }, [authUser, userRole, admin]);

  const fetchNotifications = async () => {
    if (!userId || !role) return;
    setLoading(true);
    const selectedApi =
      role === "users"
        ? userApi
        : role === "instructors"
        ? instructorApi
        : adminApi;

    try {
      const res = await selectedApi.get<INotification[]>(
        `/${role}/notifications/${userId}`
      );
      setNotifications(res.data);
      const unread = res.data.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: string) => {
    if (!userId || !role) return;
    const selectedApi =
      role === "users"
        ? userApi
        : role === "instructors"
        ? instructorApi
        : adminApi;

    try {
      await selectedApi.put(`/${role}/notifications/read/${notificationId}`);
      setNotifications((prev) =>
        prev.map((n) => (n._id === notificationId ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  useEffect(() => {
    if (userId && role) {
      fetchNotifications();
    }
  }, [userId, role]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        loading,
        markAsRead,
        refreshNotifications: fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
