import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { errorToast, successToast } from "../../components/Toast";
import { FcGoogle } from "react-icons/fc";
import { userRegisterS } from "../../services/user.services";
import { USER_ROUTES } from "../../constants/routes.constants";

interface FormData {
  name: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

const UserRegister: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
  });

  const navigate = useNavigate();
  const [canSubmit, setCanSubmit] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!/^[A-Za-z\s]+$/.test(formData.name.trim())) {
      newErrors.name = "Name should contain only letters and spaces";
    }

    if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }

    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    const phoneRegex = /^\d{10}$/;
    if (formData.phone && !phoneRegex.test(formData.phone)) {
      newErrors.phone = "Invalid phone number format";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  useEffect(() => {
    const filled =
      formData.name.trim() &&
      formData.username.trim() &&
      formData.email.trim() &&
      formData.password.trim() &&
      formData.confirmPassword.trim() &&
      formData.phone.trim();

    setCanSubmit(Boolean(filled));
  }, [formData]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setErrors({});

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await userRegisterS(formData)
      setIsLoading(false);
      if (response && response.status === 200) {
        successToast((response.data as { message: string }).message);
        localStorage.setItem("signUpData", JSON.stringify(formData));
        navigate(USER_ROUTES.VERIFY_OTP);
      }
    } catch (err: any) {
      const msg = err.response?.data?.message;
      errorToast(msg);
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-violet-400 via-blue-500 to-violet-400 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-indigo-600 py-4 px-6">
          <h2 className="text-2xl font-bold text-white text-center">
            Create Account
          </h2>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="John Doe"
              />
              {errors.name && (
                <p className="text-sm text-red-600 mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="username"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                value={formData.username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="johndoe123"
              />
              {errors.username && (
                <p className="text-sm text-red-600 mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="text-sm text-red-600 mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="phone"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Phone Number
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="(123) 456-7890"
              />
              {errors.phone && (
                <p className="text-sm text-red-600 mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.password && (
                <p className="text-sm text-red-600 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={!canSubmit || isLoading}
                className={`w-full py-2 px-4 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                  !canSubmit || isLoading
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-indigo-600 hover:bg-indigo-700 text-white"
                }`}
              >
                {isLoading ? "Registering..." : "Register"}
              </button>

              <Link
                to={import.meta.env.GOOGLE_AUTH_URL}
                className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors flex items-center justify-center gap-2 mt-3"
              >
                <FcGoogle size={20} />
                <span>Continue with Google</span>
              </Link>
            </div>
          </form>

          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to={USER_ROUTES.LOGIN}
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
