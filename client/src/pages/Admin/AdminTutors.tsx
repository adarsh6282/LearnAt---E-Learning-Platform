import { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { useNavigate, useSearchParams } from "react-router-dom";
import { errorToast } from "../../components/Toast";
import { getTutorsS, toggleTutorBlockS } from "../../services/admin.services";
import type { Tutor } from "../../types/instructor.types";
import { ADMIN_ROUTES } from "../../constants/routes.constants";
import Pagination from "../../components/Pagination";
import type { AxiosError } from "axios";
import Table from "../../components/Table";

const AdminTutors = () => {
  const [loading, setLoading] = useState(true);
  const [blockingTutorId, setBlockingTutorId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 6;
  const navigate = useNavigate();
  const [tutors, setTutors] = useState<Tutor[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const res = await getTutorsS(currentPage, itemsPerPage, debounce);
        setTutors(res.tutors);
        setTotalPages(res.totalPages);
      } catch (err: unknown) {
        console.log(err);
        const error = err as AxiosError<{ message: string }>;
        errorToast(error.response?.data?.message || "Failed to add category");
      } finally {
        setLoading(false);
      }
    };
    fetchTutors();
  }, [currentPage, itemsPerPage, debounce]);

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
    } catch (err: unknown) {
      console.log(err);
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
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
            onKeyDown={(e) => {
              if (e.repeat) e.preventDefault();
            }}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <Table
            data={tutors}
            blockingId={blockingTutorId}
            onToggleBlock={toggleBlock}
            showView={true}
          />
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
