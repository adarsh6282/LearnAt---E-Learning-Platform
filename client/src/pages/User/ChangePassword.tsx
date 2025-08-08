import { useState, type ChangeEvent, type FormEvent } from 'react';
import { errorToast, successToast } from '../../components/Toast';
import userApi from '../../services/userApiService';

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      errorToast('Please fill in all fields.');
      return;
    }

    if (newPassword !== confirmPassword) {
      errorToast("Passwords don't match");
      return;
    }

    try {
      await userApi.post("/users/change-password", formData);
      successToast("Password changed successfully");
    } catch (err: any) {
      const msg = err.response?.data?.message;
      errorToast(msg);
    }
  };

  return (
    <div className="min-h-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 px-4 py-10">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-lg p-8 rounded-xl shadow-xl border border-white/20">
        <h2 className="text-3xl font-bold text-center text-white mb-6">
          <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
            Change Password
          </span>
        </h2>

        <div className="max-w-md mx-auto">
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              type="password"
              name="oldPassword"
              placeholder="Old Password"
              value={formData.oldPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              name="newPassword"
              placeholder="New Password"
              value={formData.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm New Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-md bg-gray-800 border border-gray-600 placeholder-gray-400 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-md bg-gradient-to-r from-cyan-400 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition"
            >
              Update Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
