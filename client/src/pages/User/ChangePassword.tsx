import { useState, type ChangeEvent, type FormEvent } from "react";
import { errorToast, successToast } from "../../components/Toast";
import { changePasswordS } from "../../services/user.services";
import type { AxiosError } from "axios";
import { KeyRound, Lock, Eye, EyeOff, ShieldCheck } from "lucide-react";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPasswords, setShowPasswords] = useState({
    old: false,
    new: false,
    confirm: false,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const toggleVisibility = (field: "old" | "new" | "confirm") => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = formData;

    if (!oldPassword || !newPassword || !confirmPassword) {
      errorToast("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      errorToast("Passwords don't match");
      return;
    }

    try {
      await changePasswordS(formData);
      successToast("Password changed successfully");
      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="flex items-center gap-3 mb-8">
        <KeyRound className="text-green-400" size={24} />
        <h2 className="text-2xl font-bold text-white">
          Change{" "}
          <span className="text-green-400 font-black italic">Password</span>
        </h2>
      </div>

      <div className="bg-black/20 rounded-2xl border border-white/5 p-6 sm:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
              <Lock size={14} className="text-green-400" />
              Old Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.old ? "text" : "password"}
                name="oldPassword"
                placeholder="Enter current password"
                value={formData.oldPassword}
                onKeyDown={(e) => {
                  if (e.repeat) e.preventDefault();
                }}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 text-white border border-white/10 placeholder-neutral-500 focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("old")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-green-400 transition-colors"
              >
                {showPasswords.old ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
              <KeyRound size={14} className="text-green-400" />
              New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.new ? "text" : "password"}
                name="newPassword"
                placeholder="Enter new password"
                value={formData.newPassword}
                onKeyDown={(e) => {
                  if (e.repeat) e.preventDefault();
                }}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 text-white border border-white/10 placeholder-neutral-500 focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("new")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-green-400 transition-colors"
              >
                {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-neutral-300 mb-2 flex items-center gap-2">
              <ShieldCheck size={14} className="text-green-400" />
              Confirm New Password
            </label>
            <div className="relative">
              <input
                type={showPasswords.confirm ? "text" : "password"}
                name="confirmPassword"
                placeholder="Re-enter new password"
                value={formData.confirmPassword}
                onKeyDown={(e) => {
                  if (e.repeat) e.preventDefault();
                }}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-black/40 text-white border border-white/10 placeholder-neutral-500 focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => toggleVisibility("confirm")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-green-400 transition-colors"
              >
                {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="group/btn relative w-full inline-flex items-center justify-center gap-2 py-3 px-6 text-base font-semibold rounded-full transition-all duration-300 ring-1 bg-white/5 text-neutral-300 ring-white/10 hover:ring-green-500/30 hover:-translate-y-0.5 overflow-hidden cursor-pointer"
          >
            <span className="absolute inset-0 bg-green-500 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
            
            <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover/btn:text-black">
              <ShieldCheck size={18} />
              Update Password
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}