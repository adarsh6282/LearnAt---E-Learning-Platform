import React, { useEffect, useState } from "react";
import { successToast } from "./Toast";
import { useNavigate } from "react-router-dom";
import userApi from "../services/userApiService";
import instructorApi from "../services/instructorApiService";

interface OtpPageProps {
  role: "users" | "instructors";
}

const ResetPassword: React.FC<OtpPageProps> = ({ role }) => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const usertoken=localStorage.getItem("usersToken")
  const instructortoken=localStorage.getItem("instructorsToken")
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (usertoken) navigate('/');
    if(instructortoken) navigate('/instructors/dashboard')
  }, [usertoken, instructortoken, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
    } else {
      setError("");
      try {
        const selectedApi = role == "users" ? userApi : instructorApi;
        const email = localStorage.getItem("email");
        const response = await selectedApi.put(`/${role}/resetpassword`, {
          email,
          newPassword,
          confirmPassword,
        });
        if (response && response.status === 200) {
          successToast((response.data as { message: string }).message);
          localStorage.removeItem("email");
          navigate(`/${role}/login`);
        }
      } catch (err) {
        setError("Something went wrong. Please try again later.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4">
  <div className="w-full max-w-md bg-gray-800 text-white rounded-lg shadow-lg p-8">
    <h2 className="text-3xl font-semibold text-center mb-6">Reset Password</h2>

    {error && (
      <p className="text-red-400 text-sm mb-4 text-center">{error}</p>
    )}

    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
          New Password
        </label>
        <input
          type="password"
          id="newPassword"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          id="confirmPassword"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="w-full px-4 py-3 rounded-lg bg-gray-700 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 transition-colors py-3 rounded-lg font-semibold text-white"
      >
        Submit
      </button>
    </form>
  </div>
</div>
  );
};

export default ResetPassword;
