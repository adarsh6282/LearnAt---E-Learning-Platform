import { User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import logo from "../assets/learnAt-removebg-preview.png"
import { USER_ROUTES } from "../constants/routes.constants";

export default function Navbar() {
  const token = localStorage.getItem("usersToken");
  const navigate = useNavigate();

  const navigateLogin = () => {
    navigate(USER_ROUTES.LOGIN);
  };

  const navigateRegister = () => {
    navigate(USER_ROUTES.REGISTER);
  };

  const handleLogout = () => {
    localStorage.removeItem("usersEmail");
    localStorage.removeItem("usersToken");
    navigate(USER_ROUTES.LOGIN);
  };

  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-gray-900 shadow-md top-0 w-full z-50 fixed">
      <img src={logo} className="w-15 h-8" alt="" />

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
      </div>

      <div className="flex items-center gap-4 text-gray-300">
        {token && (
          <>
            <Link to={USER_ROUTES.PROFILE} className="hover:text-violet-400 transition-colors">
              <User size={22} />

            </Link>
          </>
        )}
        {!token ? (
          <>
            <button
              onClick={navigateLogin}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition cursor-pointer"
            >
              Login
            </button>
            <button
              onClick={navigateRegister}
              className="bg-violet-500 text-white px-4 py-2 rounded-md hover:bg-violet-600 transition cursor-pointer"
            >
              Register
            </button>
          </>
        ) : (
          <>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
