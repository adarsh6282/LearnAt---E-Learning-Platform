import { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate } from "react-router-dom";
import { errorToast } from "../../components/Toast";
import { getTutorsS, toggleTutorBlockS } from "../../services/admin.services";
import type { Tutor } from "../../types/instructor.types";
import { ADMIN_ROUTES } from "../../constants/routes.constants";
import Pagination from "../../components/Pagination";

const AdminTutors = () => {
  const [loading, setLoading] = useState(true);
  const [blockingTutorId, setBlockingTutorId] = useState<string | null>(null);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const verifiedTutors = await getTutorsS();
        setTutors(verifiedTutors);
      } catch (err: any) {
        console.log(err);
        const msg = err.response?.data?.message;
        errorToast(msg);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      fetchTutors();
    }, 1500);
  }, []);

  const toggleBlock = async (email: string, isBlocked: boolean) => {
    setBlockingTutorId(email);
    try {
      await toggleTutorBlockS(email, isBlocked);
      setTutors((prevTutor) =>
        prevTutor.map((tutor) =>
          tutor.email === email ? { ...tutor, isBlocked: !isBlocked } : tutor
        )
      );
    } catch (err: any) {
      console.log(err);
      const msg = err.response?.data?.message;
      errorToast(msg);
    } finally {
      setBlockingTutorId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-180">
        <BeatLoader color="#7e22ce" size={30} />
      </div>
    );
  }

  const totalPages = Math.ceil(tutors.length / itemsPerPage);
  const paginatedTutors = tutors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Registered Tutors
        </h2>

        <button
          onClick={() => navigate(ADMIN_ROUTES.TUTOR_REQUESTS)}
          className="mb-4 px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition"
        >
          New Requests
        </button>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Name
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedTutors.map((tutor) => (
                <tr
                  key={tutor.email}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {tutor.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {tutor.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {tutor.isBlocked ? (
                      <span className="text-red-600 font-semibold">
                        Blocked
                      </span>
                    ) : (
                      <span className="text-green-600 font-semibold">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <button
                      disabled={blockingTutorId === tutor.email}
                      onClick={() => toggleBlock(tutor.email, tutor.isBlocked)}
                      className={`px-3 py-1 rounded text-white ${
                        tutor.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {blockingTutorId === tutor.email
                        ? "Processing..."
                        : tutor.isBlocked
                        ? "Unblock"
                        : "Block"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
      </div>
    </div>
  );
};

export default AdminTutors;
