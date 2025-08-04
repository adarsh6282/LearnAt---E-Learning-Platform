import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";
import { Bell, Loader2 } from "lucide-react";

const NotificationList = () => {
  const context = useContext(NotificationContext);

  if (!context) return <p className="text-center text-gray-500">No notifications available.</p>;

  const { notifications, markAsRead, loading } = context;

  if (loading) {
    return (
      <div className="flex justify-center items-center py-10">
        <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
      </div>
    );
  }

  if (!notifications.length) {
    return <p className="text-center text-gray-500">No notifications found.</p>;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="text-blue-500" />
          Notifications
        </h2>
      </div>

      <div className="space-y-4">
        {notifications.map((notif) => (
          <div
            key={notif._id}
            className={`rounded-lg shadow-sm border p-4 transition-all duration-300 ${
              notif.isRead
                ? "bg-white border-gray-200"
                : "bg-gradient-to-r from-blue-50 to-white border-blue-300"
            }`}
          >
            <p className="text-gray-800">{notif.message}</p>
            {!notif.isRead && (
              <button
                onClick={() => markAsRead(notif._id)}
                className="mt-2 text-sm text-blue-500 hover:underline"
              >
                Mark as read
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default NotificationList;
