import { useContext, useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import image from "../../assets/learnAt-removebg-preview.png";
import { errorToast, successToast } from "../../components/Toast";
import { userLoginS } from "../../services/user.services";
import { USER_ROUTES } from "../../constants/routes.constants";
import UserContext from "../../context/UserContext";
import type { AxiosError } from "axios";

export default function UserLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const usertoken = localStorage.getItem("usersToken");
  const { getUserProfile } = useContext(UserContext) ?? {};
  const navigate = useNavigate();

  useEffect(() => {
    if (usertoken) navigate("/home");
  }, [usertoken, navigate]);

  const validationSchema = Yup.object({
    email: Yup.string()
      .required("Email is required")
      .email("Invalid email format")
      .max(50, "Email cannot exceed 50 characters"),
    password: Yup.string()
      .required("Password is required")
      .min(8, "Password must be at least 8 characters")
      .max(20, "Password cannot exceed 20 characters")
      .matches(/[A-Z]/, "Must contain at least one uppercase letter")
      .matches(/[a-z]/, "Must contain at least one lowercase letter")
      .matches(/[0-9]/, "Must contain at least one number")
      .matches(/[@$!%*?&]/, "Must contain at least one special character"),
  });

  const handleSubmit = async (values: { email: string; password: string }) => {
    try {
      const response = await userLoginS(values.email, values.password);
      if (response && response.status === 200) {
        const token = response.data.token;
        const email = response.data.user?.email;
        localStorage.setItem("usersEmail", email);
        localStorage.setItem("usersToken", token);

        if (getUserProfile) await getUserProfile();

        successToast("User Logged in Successfully");
        setTimeout(() => navigate("/home"), 2000);
      }
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-700">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-1/2 bg-gradient-to-br from-gray-700 via-gray-600 to-gray-800 p-8 flex items-center justify-center">
            <div className="text-center text-gray-100">
              <div className="mb-8 ml-20">
                <img src={image} alt="LearnAt" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Welcome Back to LearnAt!</h3>
              <p className="text-lg opacity-90">
                Sign in to access your account and continue your journey with us.
              </p>
            </div>
          </div>

          <div className="lg:w-1/2 p-8 lg:p-12 bg-gray-800">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-100">Sign In</h2>
              <p className="text-gray-300 mt-2">Enter your credentials to access your account</p>
            </div>

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({ isSubmitting, isValid, dirty }) => (
                <Form>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                        Email address
                      </label>
                      <Field
                        id="email"
                        name="email"
                        type="email"
                        placeholder="you@example.com"
                        className="w-full py-3 pl-4 pr-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                      />
                      <ErrorMessage
                        name="email"
                        component="p"
                        className="text-sm text-red-400 mt-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                        Password
                      </label>
                      <div className="relative">
                        <Field
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="••••••••"
                          className="w-full py-3 pl-4 pr-12 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 flex items-center pr-4 text-gray-400 hover:text-gray-300 transition-colors"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                      </div>
                      <ErrorMessage
                        name="password"
                        component="p"
                        className="text-sm text-red-400 mt-1"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div></div>
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
                        disabled={isSubmitting || !isValid || !dirty}
                        className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                      >
                        {isSubmitting ? "Signing in..." : "Sign in"}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>

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
