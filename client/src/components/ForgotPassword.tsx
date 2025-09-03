import React, { useEffect, useState } from "react";
import { successToast } from "./Toast";
import { useNavigate } from "react-router-dom";
import { forgotPasswordS } from "../services/common.service";

interface OtpPageProps {
  role: "users" | "instructors";
}

const ForgotPassword: React.FC<OtpPageProps> = ({ role }) => {
  const navigate = useNavigate();
  const usertoken = localStorage.getItem("usersToken");
  const instructortoken = localStorage.getItem("instructorsToken");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (role === "users" && usertoken) navigate("/home");
    if (role == "instructors" && instructortoken)
      navigate("/instructors/dashboard");
  }, [usertoken, instructortoken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setError("");

    try {
      localStorage.setItem("email", email);
      const response = await forgotPasswordS(role, email);
      if (response && response.status === 200) {
        successToast((response.data as { message: string }).message);
        navigate(`/${role}/reset-verify-otp`);
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-2xl border border-gray-700 p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-100">Forgot Password</h2>
          <p className="text-gray-300 mt-2">
            Enter your email to receive an OTP
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-300"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`mt-1 w-full py-3 px-4 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors`}
              placeholder="you@example.com"
            />
            {error && <p className="text-sm text-red-400 mt-1">{error}</p>}
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-gray-800 transition-all duration-200"
          >
            Send OTP
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
