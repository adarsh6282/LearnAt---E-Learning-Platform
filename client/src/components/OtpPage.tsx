import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../services/apiService";
import { successToast } from "./Toast";
import type { VerifyOtpResponse } from "../types/user.types";
import type { VerifyInstructor } from "../types/instructor.types";

interface OtpPageProps {
  role: "users" | "instructors";
}

const OtpPage: React.FC<OtpPageProps> = ({ role }) => {
  const [otp, setOtp] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const stored = localStorage.getItem("signUpData");
      const userData = stored ? JSON.parse(stored) : null;

      const response = await axiosInstance.post<
        VerifyOtpResponse | VerifyInstructor
      >(`/${role}/verify-otp`, {
        ...userData,
        otp,
      });

      if (response && response.status === 201) {
        const token = response.data.token;
        const email =
          role === "users"
            ? (response.data as VerifyOtpResponse).user.email
            : (response.data as VerifyInstructor).instructor.email;

        if (token) {
          localStorage.setItem(`${role}Token`, token);
          localStorage.setItem(`${role}Email`, email);
        }
        localStorage.removeItem("signUpData");
        successToast(response.data.message);
        navigate("/");
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    setCanResend(false);
    setTimer(60);

    try {
      const stored = localStorage.getItem("signUpData");
      const userData = stored ? JSON.parse(stored) : null;

      if (!userData.email) {
        setError("Email not found for resending OTP");
        return;
      }

      await axiosInstance.post(`/${role}/resend-otp`, {
        email: userData.email,
      });
      successToast("OTP resent successfully!");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP");
      setCanResend(true);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8">
        <h2 className="text-2xl font-semibold text-center text-gray-800 mb-6">
          Verify Your Account
        </h2>

        <p className="text-sm text-gray-500 mb-4 text-center">
          Enter the 6-digit OTP
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </form>
        <div className="mt-4 text-center text-gray-600">
          {canResend ? (
            <button
              onClick={handleResend}
              className="text-blue-600 underline hover:text-blue-800"
            >
              Resend OTP
            </button>
          ) : (
            <p>
              Resend OTP in {timer} second{timer !== 1 ? "s" : ""}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OtpPage;
