import React, { useState, useEffect } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import image from "../../assets/learnAt-removebg-preview.png";
import { errorToast, successToast } from "../../components/Toast";
import { FcGoogle } from "react-icons/fc";
import { userRegisterS } from "../../services/user.services";
import { USER_ROUTES } from "../../constants/routes.constants";
import type { AxiosError } from "axios";

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
  const usertoken = localStorage.getItem("usersToken");
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

  useEffect(() => {
    if (usertoken) navigate("/home");
  }, [usertoken, navigate]);

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
    if(formData.name.length>20){
      newErrors.name= "Name cannot exceed 20 characters"
    }

    if (formData.username.length < 4) {
      newErrors.username = "Username must be at least 4 characters";
    }

    if (formData.username.length > 10) {
      newErrors.username = "Username must not exceed 10 characters";
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
      const response = await userRegisterS(formData);
      setIsLoading(false);
      if (response && response.status === 200) {
        successToast((response.data as { message: string }).message);
        localStorage.setItem("signUpData", JSON.stringify(formData));
        navigate(USER_ROUTES.VERIFY_OTP);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/5 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 p-8 flex items-center justify-center">
            <div className="text-center text-gray-100">
              <div className="mb-8 ml-15">
                <img src={image} alt="register logo" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Join Us Today!</h3>
              <p className="text-lg opacity-90">
                Create your account and become part of our amazing community.
              </p>
            </div>
          </div>

          <div className="lg:w-3/5 p-6 lg:p-8 bg-gray-800">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-100">
                Create Account
              </h2>
              <p className="text-gray-300 mt-2">
                Fill in your details to get started
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="text-sm text-red-400 mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={formData.username}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="johndoe123"
                  />
                  {errors.username && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.username}
                    </p>
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onKeyDown={(e) => {
                    if (e.repeat) e.preventDefault();
                  }}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="text-sm text-red-400 mt-1">{errors.email}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-300 mb-1"
                >
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onKeyDown={(e) => {
                    if (e.repeat) e.preventDefault();
                  }}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="(123) 456-7890"
                />
                {errors.phone && (
                  <p className="text-sm text-red-400 mt-1">{errors.phone}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="••••••••"
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {errors.password && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-300 mb-1"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-400 mt-1">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <button
                  type="submit"
                  disabled={!canSubmit || isLoading}
                  className="w-full py-3 px-4 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  {isLoading ? "Registering..." : "Create Account"}
                </button>

                <Link
                  to={import.meta.env.VITE_GOOGLE_AUTH_URL}
                  className="w-full bg-gray-700 border border-gray-600 text-gray-100 py-3 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  <FcGoogle size={20} />
                  <span>Continue with Google</span>
                </Link>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-gray-400">
              Already have an account?{" "}
              <Link
                to={USER_ROUTES.LOGIN}
                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
              >
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
