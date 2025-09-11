import { useEffect, useState } from "react";
import { AlertCircle, CheckCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { errorToast, successToast } from "../components/Toast";
import { Link, useSearchParams } from "react-router-dom";
import Pagination from "./Pagination";
import {
  getComplaintsS,
  refreshedComplaint,
  updateComplaint,
} from "../services/admin.services";

interface Complaint {
  _id: string;
  type: "report" | "complaint";
  subject: string;
  message: string;
  status: "pending" | "resolved" | "rejected";
  response: string;
  userId: { name: string; email: string };
  targetId?: { _id: string; title: string };
  createdAt: string;
}

const AdminComplaint: React.FC = () => {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 1;
  const [totalPages, setTotalPages] = useState<number>(1);
  const isFormValid = () => {
    return response !== "";
  };
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(
    null
  );
  const [response, setResponse] = useState("");
  const [status, setStatus] = useState("resolved");
  const [searchTerm, setSearchTerm] = useState("");
  const [debounce, setDebounce] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(searchTerm);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const res = await getComplaintsS(
          currentPage,
          itemsPerPage,
          debounce,
          selectedStatus
        );
        setComplaints(res.data.complaints);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        errorToast("Failed to fetch complaints");
        console.error(err);
      }
    };
    fetchReports();
  }, [currentPage, itemsPerPage, debounce, selectedStatus]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  const handleSubmit = async () => {
    if (!selectedComplaint) return;
    try {
      await updateComplaint(selectedComplaint._id, status, response);
      successToast("Response submitted successfully");
      const refreshed = await refreshedComplaint();
      setComplaints(refreshed.data);
      setSelectedComplaint(null);
      setResponse("");
      setStatus("resolved");
    } catch (err) {
      console.log(err);
      errorToast("Failed to respond");
    }
  };

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Admin Complaint Management
          </h2>
          <p className="text-slate-600">
            Manage and respond to user complaints and reports
          </p>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <input
            type="text"
            placeholder="Search complaints..."
            value={searchTerm}
            onKeyDown={(e) => {
              if (e.repeat) e.preventDefault();
            }}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2 w-64"
          />

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-300 rounded-md px-3 py-2"
          >
            <option value="">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        {complaints.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No complaints found
              </h3>
              <p className="text-slate-600">
                No complaints have been submitted yet.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((c) => (
              <div
                key={c._id}
                className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm"
              >
                <div className="flex justify-between items-center mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">
                      {c.subject}
                    </h3>
                    <p className="text-sm text-slate-500">
                      <strong>User:</strong> {c.userId.name}
                      {c.targetId && (
                        <>
                          {" "}
                          | <strong>Course:</strong> {c.targetId.title}
                        </>
                      )}
                    </p>
                  </div>
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                      c.status === "pending"
                        ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                        : c.status === "resolved"
                          ? "bg-green-100 text-green-800 border-green-200"
                          : "bg-red-100 text-red-800 border-red-200"
                    }`}
                  >
                    {c.status === "resolved" ? (
                      <CheckCircle className="w-4 h-4 mr-1" />
                    ) : (
                      <AlertCircle className="w-4 h-4 mr-1" />
                    )}
                    {c.status}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setSelectedComplaint(c);
                    setStatus("resolved");
                    setResponse("");
                  }}
                  className="mt-2 text-sm text-blue-600 hover:underline font-medium"
                >
                  View
                </button>
              </div>
            ))}
          </div>
        )}

        {selectedComplaint && (
          <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-xl relative">
              <h3 className="text-xl font-bold mb-4 text-slate-800">
                {selectedComplaint.status === "pending"
                  ? "Respond to"
                  : "Complaint Details"}
                : {selectedComplaint.subject}
              </h3>

              <div className="text-sm text-slate-600 mb-2">
                <strong>User:</strong> {selectedComplaint.userId.name} (
                {selectedComplaint.userId.email})
              </div>
              {selectedComplaint.targetId && (
                <div className="text-sm text-slate-600 mb-2 flex items-center justify-between">
                  <div>
                    <strong>Course:</strong> {selectedComplaint.targetId.title}
                  </div>
                  <Link
                    to={`/admin/courses/${selectedComplaint.targetId._id}`}
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm font-medium"
                  >
                    View Course
                  </Link>
                </div>
              )}
              <div className="text-sm text-slate-600 mb-2">
                <strong>Submitted:</strong>{" "}
                {formatDistanceToNow(new Date(selectedComplaint.createdAt))} ago
              </div>

              <div className="text-slate-700 mb-4">
                <strong>Message:</strong>
                <div className="bg-slate-100 rounded-md p-2 mt-1">
                  {selectedComplaint.message}
                </div>
              </div>

              {selectedComplaint.response && (
                <div className="text-green-700 mb-4">
                  <strong>Previous Response:</strong>
                  <div className="bg-green-50 p-2 rounded mt-1">
                    {selectedComplaint.response}
                  </div>
                </div>
              )}

              {selectedComplaint.status === "pending" ? (
                <>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Response
                    </label>
                    <textarea
                      rows={3}
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Status
                    </label>
                    <select
                      value={status}
                      onChange={(e) => setStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="resolved">Resolved</option>
                      <option value="rejected">Rejected</option>
                    </select>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      onClick={() => setSelectedComplaint(null)}
                      className="px-4 py-2 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-100"
                    >
                      Cancel
                    </button>
                    <button
                      disabled={!isFormValid()}
                      onClick={handleSubmit}
                      className={`px-4 py-2 text-white rounded-md ${
                        isFormValid()
                          ? "bg-blue-700 hover:bg-blue-600"
                          : "bg-gray-600 cursor-not-allowed"
                      }`}
                    >
                      Submit
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-end mt-4">
                  <button
                    onClick={() => setSelectedComplaint(null)}
                    className="px-4 py-2 text-slate-700 border border-slate-300 rounded-md hover:bg-slate-100"
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AdminComplaint;
