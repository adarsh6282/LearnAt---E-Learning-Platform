import { useState, useContext } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  DollarSign,
  BookOpen,
  FolderOpen,
  Settings,
  LogOut,
  Edit2,
  Menu,
  X,
} from "lucide-react";
import { MdReport } from "react-icons/md";
import { ADMIN_ROUTES } from "../constants/routes.constants";
import NotificationContext from "../context/NotificationContext";
import { adminLogoutS } from "../services/admin.services";

const AdminNavbar = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const notificationContext = useContext(NotificationContext);

  if (!notificationContext) return null;
  const { unreadCount } = notificationContext;

  const handleLogout = async () => {
    try {
      await adminLogoutS();
      localStorage.removeItem("adminEmail");
      localStorage.removeItem("adminToken");
      navigate(ADMIN_ROUTES.LOGIN);
    } catch (err) {
      console.log(err);
    }
  };

  const navItems = [
    { name: "Dashboard", icon: LayoutDashboard },
    { name: "Users", icon: Users },
    { name: "Tutors", icon: GraduationCap },
    { name: "Earnings", icon: DollarSign },
    { name: "Courses", icon: BookOpen },
    { name: "Category", icon: FolderOpen },
    { name: "Reviews", icon: Edit2 },
    { name: "Complaints", icon: MdReport },
  ];

  const getRoutePath = (itemName: string) =>
    `${ADMIN_ROUTES.BASE}/${itemName.toLowerCase()}`;

  return (
    <div className="flex bg-gray-100 h-screen overflow-hidden">
      <div className="hidden md:flex fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 shadow-2xl border-r border-purple-700/30 flex-col">
        <div className="flex items-center justify-center p-6 border-b border-purple-700/30">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">A</span>
            </div>
            <span className="text-white font-bold text-xl">Admin Panel</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          <div className="space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === getRoutePath(item.name);
              return (
                <Link
                  key={item.name}
                  to={getRoutePath(item.name)}
                  className={`${
                    isActive
                      ? "bg-purple-700 bg-opacity-70 text-white shadow-lg border-r-4 border-pink-400"
                      : "text-purple-100 hover:bg-purple-700 hover:bg-opacity-50 hover:text-white"
                  } w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group`}
                >
                  <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        <div className="border-t border-purple-700/30 p-4">
          <Link
            to="/admin/notifications"
            className="w-full flex items-center space-x-3 px-4 py-3 text-purple-100 hover:text-white hover:bg-purple-700 hover:bg-opacity-50 rounded-lg transition-all duration-200 mb-2"
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
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 text-red-300 hover:text-red-200 hover:bg-red-900 hover:bg-opacity-50 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div
        className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300 ${
          sidebarOpen ? "opacity-100 visible" : "opacity-0 invisible"
        }`}
        onClick={() => setSidebarOpen(false)}
      />
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 shadow-2xl border-r border-purple-700/30 z-50 transform transition-transform duration-300 md:hidden ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-purple-700/30">
          <span className="text-white font-bold text-xl">Admin Panel</span>
          <button onClick={() => setSidebarOpen(false)}>
            <X className="text-white w-6 h-6" />
          </button>
        </div>
        <nav className="flex-1 px-4 py-6 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === getRoutePath(item.name);
            return (
              <Link
                key={item.name}
                to={getRoutePath(item.name)}
                onClick={() => setSidebarOpen(false)}
                className={`${
                  isActive
                    ? "bg-purple-700 bg-opacity-70 text-white shadow-lg border-r-4 border-pink-400"
                    : "text-purple-100 hover:bg-purple-700 hover:bg-opacity-50 hover:text-white"
                } w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 group`}
              >
                <Icon className="w-5 h-5 group-hover:scale-110 transition-transform duration-200" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex-1 md:ml-64 flex flex-col h-screen overflow-hidden">
        <div className="md:hidden flex items-center justify-between p-4 bg-white shadow">
          <button onClick={() => setSidebarOpen(true)}>
            <Menu className="w-6 h-6 text-purple-700" />
          </button>
          <span className="font-semibold text-lg text-gray-800">
            Admin Panel
          </span>
          <div className="relative">
            {unreadCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
            <Settings className="w-5 h-5 text-purple-700" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="overflow-x-auto">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
