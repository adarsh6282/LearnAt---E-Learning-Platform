import { useContext, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Plus,
  BookOpen,
  DollarSign,
  Settings,
  LogOut,
  ListCheck,
  BookmarkCheck,
} from "lucide-react";
import { BiChat } from "react-icons/bi";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import InstructorContext from "../context/InstructorContext";
import { INSTRUCTOR_ROUTES } from "../constants/routes.constants";
import NotificationContext from "../context/NotificationContext";
import { useAuth } from "../hooks/useAuth";
import { socket } from "../services/socket.service";
import {
  instructorLogout,
  unreadCountS,
} from "../services/instructor.services";
import { MdQuiz } from "react-icons/md";

const InstructorNavbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useContext(InstructorContext);
  const { authUser } = useAuth();
  const [readCount, setUnreadCount] = useState(0);
  const notificationContext = useContext(NotificationContext);

  useEffect(() => {
    const fetchUnread = async () => {
      if (!authUser?._id) return;
      const userModel = authUser.role === "user" ? "User" : "Instructor";

      try {
        const count = await unreadCountS(authUser._id, userModel);
        setUnreadCount(count);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUnread();
    socket.on("newMessageForBadge", fetchUnread);

    return () => {
      socket.off("newMessageForBadge", fetchUnread);
    };
  }, [authUser?._id, authUser?.role]);

  if (!context || !notificationContext) return <div>Loading...</div>;

  const { unreadCount } = notificationContext;
  const { instructor } = context;

  const handleLogout = async () => {
    try {
      await instructorLogout();
      localStorage.removeItem("instructorsToken");
      localStorage.removeItem("instructorsEmail");
      navigate(INSTRUCTOR_ROUTES.LOGIN);
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  const getRoutePath = (itemName: string) =>
    `${INSTRUCTOR_ROUTES.BASE}/${itemName.toLowerCase()}`;

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Create-Course", icon: Plus },
    { name: "Courses", icon: BookOpen },
    { name: "Earnings", icon: DollarSign },
    { name: "Reviews", icon: ListCheck },
    { name: "Enrollments", icon: BookmarkCheck },
    { name: "Chat", icon: BiChat },
    { name: "Quiz", icon: MdQuiz },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gradient-to-b from-blue-900 via-blue-800 to-indigo-900 shadow-2xl border-r border-blue-700/30 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-center p-6 border-b border-blue-700/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">I</span>
              </div>
              <span className="text-white font-bold text-xl">
                Instructor Panel
              </span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-4 mt-[-8px]">
            <div className="space-y-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === getRoutePath(item.name);
                return (
                  <Link
                    key={item.name}
                    to={getRoutePath(item.name)}
                    className={`${
                      isActive
                        ? "bg-blue-700 bg-opacity-70 text-white shadow-lg border-r-4 border-cyan-400"
                        : "text-blue-100 hover:bg-blue-700 hover:bg-opacity-50 hover:text-white"
                    } w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group`}
                  >
                    <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                    <span>{item.name}</span>
                    {item.name === "Chat" && readCount > 0 && (
                      <span className="absolute w-5 h-5 ml-38 bg-green-500 rounded-full animate-pulse"></span>
                    )}
                  </Link>
                );
              })}
            </div>
          </nav>
        </div>

        <div className="border-t border-blue-700/30 p-6">
          <Link
            to={INSTRUCTOR_ROUTES.NOTIFICATIONS}
            className="w-full flex items-center justify-between px-4 py-2 text-blue-100 hover:text-white hover:bg-blue-700 hover:bg-opacity-50 rounded-lg transition-all duration-200 mb-2"
          >
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5" />
              <span>Notifications</span>
            </div>

            {unreadCount > 0 && (
              <span className="inline-flex items-center justify-center text-xs font-semibold text-white bg-red-500 rounded-full h-5 w-5">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>

          <button
            onClick={() => navigate(INSTRUCTOR_ROUTES.PROFILE)}
            className="bg-blue-800 bg-opacity-50 hover:bg-opacity-70 rounded-lg p-3 mb-2 block transition-all duration-200 w-full"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full overflow-hidden">
                <img
                  src={instructor?.profilePicture || "/default-profile.jpg"}
                  alt="Instructor"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-left">
                <p className="text-white font-medium text-sm">
                  {instructor?.name}
                </p>
                <p className="text-blue-200 text-xs">Instructor</p>
              </div>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-900 hover:bg-opacity-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default InstructorNavbar;
