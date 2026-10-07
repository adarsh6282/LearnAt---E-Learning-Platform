import { useState } from "react";
import { successToast, errorToast } from "./Toast";
import { giveComplaintS } from "../services/user.services";
import { Bug, Flag, X } from "lucide-react";

const ReportForm = ({
  type,
  subject = "",
  targetId,
}: {
  type: "report" | "complaint";
  subject?: string;
  targetId?: string;
}) => {
  const [form, setForm] = useState({
    subject,
    message: "",
  });
  const [isOpen, setIsOpen] = useState(false);

  const isFormValid = () => {
    return form.subject.trim() !== "" && form.message.trim() !== "";
  };

  const handleSubmit = async () => {
    if (!isFormValid()) return;
    try {
      await giveComplaintS(type, form.subject, form.message, targetId);
      successToast("Report Submitted Successfully");
      setIsOpen(false);
      setForm({ subject, message: "" });
    } catch (err) {
      console.error(err);
      errorToast("Failed to submit report. Please try again.");
    }
  };

  return (
    <div className="mt-4">
      <button
        onClick={() => setIsOpen(true)}
        className="group/btn relative inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ring-1 bg-white/5 text-neutral-300 ring-white/10 hover:ring-green-500/30 hover:-translate-y-0.5 overflow-hidden cursor-pointer"
      >
        <span className="absolute inset-0 bg-green-500 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
        <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover/btn:text-black">
          {type === "report" ? <Flag size={14} /> : <Bug size={14} />}
          {type === "report" ? "Report Course" : "Report a Bug"}
        </span>
      </button>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4 transition-opacity"
          onClick={() => setIsOpen(false)}
        >
          <div
            className="bg-neutral-900 border border-white/10 rounded-2xl w-full max-w-md shadow-2xl relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center p-6 border-b border-white/5">
              <h3 className="text-white text-lg font-bold flex items-center gap-2">
                {type === "report" ? <Flag size={18} className="text-green-400" /> : <Bug size={18} className="text-green-400" />}
                {type === "report" ? "Report Course Issue" : "Submit a Bug Report"}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white transition-colors p-1 rounded-full hover:bg-white/5"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-4">
              {!subject && (
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    placeholder="Briefly describe the issue"
                    value={form.subject}
                    onKeyDown={(e) => {
                      if (e.repeat) e.preventDefault();
                    }}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-black/40 text-white border border-white/10 rounded-lg focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Message
                </label>
                <textarea
                  placeholder="Provide detailed information..."
                  value={form.message}
                  onKeyDown={(e) => {
                    if (e.repeat) e.preventDefault();
                  }}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  className="w-full px-4 py-2.5 bg-black/40 text-white border border-white/10 rounded-lg focus:border-transparent focus:ring-2 focus:ring-green-500 outline-none transition-all resize-none"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 p-6 bg-black/20 border-t border-white/5">
              <button
                onClick={() => setIsOpen(false)}
                className="px-5 py-2.5 rounded-full text-sm font-medium text-neutral-300 hover:bg-white/5 hover:text-white transition-all duration-300"
              >
                Cancel
              </button>

              <button
                disabled={!isFormValid()}
                onClick={handleSubmit}
                className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 cursor-pointer ${
                  isFormValid()
                    ? "bg-green-500 text-black hover:bg-green-400 hover:-translate-y-0.5 shadow-lg shadow-green-500/20"
                    : "bg-neutral-700 text-neutral-400 cursor-not-allowed"
                }`}
              >
                Submit Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportForm;