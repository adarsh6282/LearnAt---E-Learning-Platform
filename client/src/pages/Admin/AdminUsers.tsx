import { useState, useEffect } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { errorToast } from "../../components/Toast";
import type { User } from "../../types/user.types";
import { getUsersS, toggleUserBlockS } from "../../services/admin.services";
import Pagination from "../../components/Pagination";

const AdminUsers = () => {
  const [blockingUserId, setBlockingUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 1;
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getUsersS();
        setUsers(res.data);
      } catch (err: any) {
        console.log(err);
        const msg = err.response?.data?.message;
        errorToast(msg);
      } finally {
        setLoading(false);
      }
    };
    setTimeout(() => {
      fetchUsers();
    }, 1500);
  }, []);

  const toggleBlock = async (email: string, isBlocked: boolean) => {
    setBlockingUserId(email);
    try {
      await toggleUserBlockS(email, isBlocked);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.email === email ? { ...user, isBlocked: !isBlocked } : user
        )
      );
    } catch (err: any) {
      const msg = err.response?.data?.message;
      errorToast(msg);
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

  const totalPages = Math.ceil(users.length / itemsPerPage);

  const paginatedUsers = users.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Registered Users
        </h2>

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
              {paginatedUsers.map((user) => (
                <tr
                  key={user.email}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {user.isBlocked ? (
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
                      disabled={blockingUserId === user.email}
                      onClick={() => toggleBlock(user.email, user.isBlocked)}
                      className={`px-3 py-1 rounded text-white ${
                        user.isBlocked
                          ? "bg-green-600 hover:bg-green-700"
                          : "bg-red-600 hover:bg-red-700"
                      }`}
                    >
                      {blockingUserId === user.email
                        ? "Processing..."
                        : user.isBlocked
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
          onPageChange={setCurrentPage}
          totalPages={totalPages}
        />
      </div>
    </div>
  );
};

export default AdminUsers;
