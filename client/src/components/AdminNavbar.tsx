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
} from "lucide-react";
import { MdReport } from "react-icons/md";
import { ADMIN_ROUTES } from "../constants/routes.constants";
import adminApi from "../services/adminApiService";
import { useContext } from "react";
import { NotificationContext } from "../context/NotificationContext";

const AdminNavbar = () => {
  const navigate = useNavigate();
  const{unreadCount}=useContext(NotificationContext)
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await adminApi.post("/admin/logout", {}, { withCredentials: true });
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

  const getRoutePath = (itemName: string) => {
    return `${ADMIN_ROUTES.BASE}/${itemName.toLowerCase()}`;
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-64 bg-gradient-to-b from-purple-900 via-purple-800 to-indigo-900 shadow-2xl border-r border-purple-700/30">
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-center p-6 border-b border-purple-700/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">A</span>
              </div>
              <span className="text-white font-bold text-xl">Admin Panel</span>
            </div>
          </div>

          <nav className="flex-1 px-4 py-6">
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
      </div>

      <div className="flex-1 p-8">
        <Outlet />
      </div>
    </div>
  );
};

export default AdminNavbar;
