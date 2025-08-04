import { User, Bell } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/learnAt-removebg-preview.png";
import { USER_ROUTES } from "../constants/routes.constants";
import userApi from "../services/userApiService";

export default function Navbar() {
  const token = localStorage.getItem("usersToken");
  const navigate = useNavigate();

  const navigateLogin = () => navigate(USER_ROUTES.LOGIN);
  const navigateRegister = () => navigate(USER_ROUTES.REGISTER);

  const handleLogout = async () => {
    try {
      await userApi.post("/users/logout", {}, { withCredentials: true });
      localStorage.removeItem("usersEmail");
      localStorage.removeItem("usersToken");
      navigate(USER_ROUTES.LOGIN);
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-gray-900 shadow-md top-0 w-full z-50 fixed">
      <img src={logo} className="w-15 h-8" alt="Logo" />

      <div className="hidden md:flex items-center gap-6 text-gray-300">
        <Link to={USER_ROUTES.COURSES} className="hover:text-blue-400 transition-colors">
          Courses
        </Link>
        <a href="#about" className="hover:text-blue-400 transition-colors">
          About
        </a>
        <a href="#contact" className="hover:text-blue-400 transition-colors">
          Contact Us
        </a>
        <Link to="/users/chat" className="hover:text-blue-400 transition-colors">
          Chats
        </Link>
      </div>

      <div className="flex items-center gap-4 text-gray-300">
        {token && (
          <>
            <Link to="/users/notifications" className="hover:text-yellow-400 transition-colors">
              <Bell size={22} />
            </Link>
            <Link to={USER_ROUTES.PROFILE} className="hover:text-violet-400 transition-colors">
              <User size={22} />
            </Link>
          </>
        )}
        {!token ? (
          <>
            <button
              onClick={navigateLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </button>
            <button
              onClick={navigateRegister}
              className="bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition"
            >
              Register
            </button>
          </>
        ) : (
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}
