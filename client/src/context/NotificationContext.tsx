import {
  createContext,
  useState,
  useEffect,
  useMemo,
  type ReactNode,
  useRef,
  useCallback,
} from "react";
import { useAuth } from "../hooks/useAuth";
import useAdmin from "../hooks/useAdmin";
import type { Socket } from "socket.io-client";
import { io } from "socket.io-client";
import { toast } from "react-hot-toast";
import {
  instructorNotification,
  markAsReadInstructor,
} from "../services/instructor.services";
import { adminNotification, markAsReadAdmin } from "../services/admin.services";
import { markAsReadS, userNotification } from "../services/user.services";

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

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider = ({
  children,
}: NotificationProviderProps) => {
  const { authUser, role: userRole } = useAuth();
  const admin = useAdmin();

  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const socketRef = useRef<Socket | null>(null);

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

  const fetchNotifications = useCallback(async () => {
    if (!userId || !role) return;
    setLoading(true);

    try {
      if (role == "users") {
        const res = await userNotification(userId);
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } else if (role === "instructors") {
        const res = await instructorNotification(userId);
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      } else {
        const res = await adminNotification(userId);
        setNotifications(res.data);
        const unread = res.data.filter((n) => !n.isRead).length;
        setUnreadCount(unread);
      }
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    } finally {
      setLoading(false);
    }
  }, [userId, role]);

  const markAsRead = async (notificationId: string) => {
    if (!userId || !role) return;

    try {
      if (role == "users") {
        await markAsReadS(notificationId);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } else if (role == "instructors") {
        await markAsReadInstructor(notificationId);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      } else {
        await markAsReadAdmin(notificationId);
        setNotifications((prev) =>
          prev.map((n) =>
            n._id === notificationId ? { ...n, isRead: true } : n
          )
        );
        setUnreadCount((prev) => Math.max(prev - 1, 0));
      }
    } catch (err) {
      console.error("Failed to mark as read:", err);
    }
  };

  useEffect(() => {
    if (userId && role) {
      fetchNotifications();
    }
  }, [userId, role, fetchNotifications]);

  useEffect(() => {
    if (!userId) return;

    socketRef.current = io(import.meta.env.VITE_SOCKET_URL, {
      withCredentials: true,
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket:", socketRef.current?.id);
      socketRef.current?.emit("joinNotificationRoom", userId);
    });

    socketRef.current.on("newNotification", (message: string) => {
      toast(message || "You have a new message", {
        icon: "ℹ️",
        style: {
          background: "#3b82f6",
          color: "#fff",
        },
      });

      fetchNotifications();
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, [userId, fetchNotifications]);

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

export default NotificationContext;
