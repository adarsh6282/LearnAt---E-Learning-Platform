import { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { errorToast } from "../../components/Toast";
import type { User } from "../../types/user.types";
import { getUsersS, toggleUserBlockS } from "../../services/admin.services";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";
import Table from "../../components/Table";

const AdminUsers = () => {
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 5;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersS(currentPage, itemsPerPage, debounce);
        setUsers(res.data.users);
        setTotalPages(res.data.totalPages);
      } catch (err: unknown) {
        console.log(err);
        const error = err as AxiosError<{ message: string }>;
        errorToast(error.response?.data?.message ?? "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage, itemsPerPage,debounce]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  const toggleBlock = async (email: string, isBlocked: boolean) => {
    setBlockingUserId(email);
    try {
      await toggleUserBlockS(email, isBlocked);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, isBlocked: !isBlocked } : user
        )
      );
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    } finally {
      setBlockingUserId(null);
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
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Registered Users
        </h2>

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

          <Table
            data={users}
            blockingId={blockingUserId}
            onToggleBlock={toggleBlock}
            showView={false}
          />

        </div>
        
        <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AdminUsers;
