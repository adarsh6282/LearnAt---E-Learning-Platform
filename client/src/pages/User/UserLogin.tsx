import { useContext, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import image from "../../assets/learnAt-removebg-preview.png";
import { errorToast, successToast } from "../../components/Toast";
import { useNavigate, Link } from "react-router-dom";
import { userLoginS } from "../../services/user.services";
import { USER_ROUTES } from "../../constants/routes.constants";
import { UserContext } from "../../context/UserContext";

export default function UserLogin() {
  const [email, setEmail] = useState("");
  const [canSubmit, setCanSubmit] = useState(false);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const usertoken = localStorage.getItem("usersToken");
  const { getUserProfile } = useContext(UserContext) ?? {};
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (usertoken) navigate("/home");
  }, [usertoken, navigate]);

  useEffect(() => {
    const filled = email.trim() && password.trim();

    setCanSubmit(Boolean(filled));
  });

  const validateForm = () => {
    const newErrors: { email?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email.trim())) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await userLoginS(email, password);
      setIsLoading(false);
      if (response && response.status === 200) {
        const token = response.data.token;
        const email = response.data.user?.email;
        localStorage.setItem("usersEmail", email);
        localStorage.setItem("usersToken", token);
        if (getUserProfile) {
          await getUserProfile();
        }
        successToast("User Registered Successfully");
        setTimeout(() => {
          navigate("/home");
        }, 2000);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;
      errorToast(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 p-8 flex items-center justify-center">
            <div className="text-center text-gray-100">
              <div className="mb-8 ml-20">
                <img src={image} alt="" />
              </div>
              <h3 className="text-3xl font-bold mb-4">
                Welcome Back to LearnAt!
              </h3>
              <p className="text-lg opacity-90">
                Sign in to access your account and continue your journey with
                us.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 p-8 lg:p-12 bg-gray-800">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-100">Sign In</h2>
              <p className="text-gray-300 mt-2">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full py-3 pl-4 pr-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="you@example.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-400 mt-1">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full py-3 pl-4 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      placeholder="••••••••"
                    />
                    {errors.password && (
                      <p className="text-sm text-red-400 mt-1">
                        {errors.password}
                      </p>
                    )}
                    <button
                      type="button"
                      className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-300 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center"></div>
                  <div className="text-sm">
                    <Link
                      to={USER_ROUTES.FORGOT_PASSWORD}
                      className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      Forgot password?
                    </Link>
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={!canSubmit || isLoading}
                    className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    {isLoading ? "Signing in..." : "Sign in"}
                  </button>
                </div>
              </div>
            </form>

            <div className="mt-8 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <Link
                  to={USER_ROUTES.REGISTER}
                  className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
