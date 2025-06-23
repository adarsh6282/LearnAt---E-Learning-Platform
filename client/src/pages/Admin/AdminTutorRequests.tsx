import { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { errorToast } from "../../components/Toast";
import type { Tutor } from "../../types/instructor.types";
import {
  getRequestsS,
  handleAcceptS,
  handleRejectS,
} from "../../services/admin.services";
import Pagination from "../../components/Pagination";

const AdminTutorRequests = () => {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<Tutor[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [expandedEmail, setExpandedEmail] = useState<string | null>(null);
  const [rejectingEmail, setRejectingEmail] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState<string>("");

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const unverifiedTutors = await getRequestsS();
        setRequests(unverifiedTutors);
      } catch (err: any) {
        const msg = err.response?.data?.message;
        errorToast(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchRequests();
  }, []);

  const handleAccept = async (email: string) => {
    try {
      await handleAcceptS(email);
      setRequests((prev) => prev.filter((t) => t.email !== email));
    } catch (err: any) {
      const msg = err.response?.data?.message;
      errorToast(msg);
    }
  };

  const handleReject = async (email: string, reason: string) => {
    try {
      await handleRejectS(email, reason);
      setRequests((prev) => prev.filter((t) => t.email !== email));
    } catch (err: any) {
      console.log(err);
      const msg = err.response?.data?.message;
      errorToast(msg);
    }
  };

  const confirmReject = async (email: string) => {
    try {
      await handleReject(email, rejectReason);
      setRejectingEmail(null);
      setRejectReason("");
    } catch (err: any) {

    }finally{

    }
  };

  const toggleDetails = (email: string) => {
    setExpandedEmail((prev) => (prev === email ? null : email));
  };

  const openRejectModal = (email: string) => {
    setRejectingEmail(email);
    setRejectReason("");
  };

  const totalPages = Math.ceil(requests.length / itemsPerPage);
  const paginatedRequests = requests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return loading ? (
    <div className="flex justify-center items-center h-180">
      <BeatLoader color="#7e22ce" size={30} />
    </div>
  ) : (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Tutor Verification Requests
        </h2>

        {paginatedRequests.length === 0 ? (
          <p className="text-gray-500">No pending tutor requests.</p>
        ) : (
          <div className="space-y-4">
            {requests.map((tutor) => (
              <div
                key={tutor.email}
                className="bg-white rounded-lg shadow-md p-4 border border-gray-200"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {tutor.name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Email: {tutor.email}
                    </p>
                    <p className="text-sm text-gray-600">
                      Title: {tutor.title}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleDetails(tutor.email)}
                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                  >
                    {expandedEmail === tutor.email ? "Hide" : "View"}
                  </button>
                </div>

                {expandedEmail === tutor.email && (
                  <div className="mt-4 border-t pt-4 space-y-1 text-sm text-gray-600">
                    <p>
                      <strong>Username:</strong> {tutor.username}
                    </p>
                    <p>
                      <strong>Phone:</strong> {tutor.phone}
                    </p>
                    <p>
                      <strong>Experience:</strong> {tutor.yearsOfExperience}{" "}
                      years
                    </p>
                    <p>
                      <strong>Education:</strong> {tutor.education}
                    </p>
                    <p>
                      <strong>Account Status:</strong> {tutor.accountStatus}
                    </p>
                    <p>
                      <strong>Role:</strong> {tutor.role}
                    </p>
                    <p>
                      <strong>Resume:</strong>
                      <a
                        href={tutor.resume}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline ml-1"
                      >
                        View Resume
                      </a>
                    </p>

                    <div className="flex gap-4 mt-4">
                      <button
                        onClick={() => handleAccept(tutor.email)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => openRejectModal(tutor.email)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>

      {rejectingEmail && (
        <div className="fixed inset-0 bg-gray-900/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Reject Tutor
            </h2>
            <label className="block text-gray-700 mb-2">
              Reason for rejection:
            </label>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="w-full border border-gray-300 rounded p-2 text-sm"
              rows={3}
              placeholder="Enter a brief reason..."
            ></textarea>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => confirmReject(rejectingEmail)}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Send
              </button>
              <button
                onClick={() => {
                  setRejectingEmail(null);
                  setRejectReason("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminTutorRequests;
