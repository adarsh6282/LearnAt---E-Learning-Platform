import { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { errorToast } from "../../components/Toast";
import { getTutorsS, toggleTutorBlockS } from "../../services/admin.services";
import type { Tutor } from "../../types/instructor.types";
import { ADMIN_ROUTES } from "../../constants/routes.constants";
import Pagination from "../../components/Pagination";

const AdminTutors = () => {
  const [loading, setLoading] = useState(true);
  const [blockingTutorId, setBlockingTutorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await getTutorsS(currentPage, itemsPerPage, searchQuery);
        setTutors(res.tutors);
        setTotalPages(res.totalPages);
      } catch (err: any) {
        console.log(err);
        const msg = err.response?.data?.message;
        errorToast(msg);
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, [currentPage, itemsPerPage, searchQuery]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

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

  return (
    <div className="p-6 bg-gray-50 min-h-full">
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

        <div className="mb-6 max-w-md">
          <input
            type="text"
            placeholder="Search by course title or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

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
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  View
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tutors.map((tutor) => (
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
                  <td>
                    <Link className="text-blue-600 hover:underline hover:text-blue-800 transition duration-200" to={`/admin/tutor-view/${tutor._id}`}>View Details</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminTutors;
