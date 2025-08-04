import NotificationList from "../../components/NotificationList";

const UserNotification = () => {
  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-2xl font-semibold mb-4">User Notifications</h2>
      <NotificationList />
    </div>
  );
};

export default UserNotification;
