import { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import type { FormEvent } from "react";
import { errorToast, successToast } from "../../components/Toast";
import { useNavigate, Link } from "react-router-dom";
import { instructorLoginS } from "../../services/instructor.services";
import { INSTRUCTOR_ROUTES } from "../../constants/routes.constants";
import type { AxiosError } from "axios";

export default function InstructorLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const instructortoken=localStorage.getItem("instructorsToken")
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if(instructortoken) navigate('/instructors/dashboard')
  }, [instructortoken, navigate]);

  const isFormValid = () => {
    return email !== "" && password !== "";
  };

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      newErrors.email = "Invalid email format";
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
      const response = await instructorLoginS(email, password);
      setIsLoading(false);
      if (response && response.status === 200) {
        const token = response.data.token;
        const email = response.data.instructor?.email;
        localStorage.setItem("instructorsEmail", email);
        localStorage.setItem("instructorsToken", token);
        successToast("Instructor Logined Successfully");
        navigate(INSTRUCTOR_ROUTES.DASHBOARD);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto p-6 mt-35 rounded-lg shadow-lg ">
      <div className="text-center mb-8 ">
        <h2 className="text-2xl font-bold text-gray-800">Welcome back</h2>
        <p className="text-gray-600 mt-2">Enter your credentials to sign in</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
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
                className="w-full py-2 pl-3 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="you@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
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
                className="w-full py-2 pl-3 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="••••••••"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center"></div>
            <div className="text-sm">
              <Link
                to={INSTRUCTOR_ROUTES.FORGOT_PASSWORD}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading || !isFormValid()}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </div>
      </form>

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          Don't have an account?{" "}
          <a className="font-medium text-blue-600 hover:text-blue-500">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
