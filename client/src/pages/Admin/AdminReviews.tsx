import { useEffect, useState } from "react";
import axiosInstance from "../../services/apiService";

interface Review {
  _id: string;
  text: string;
  rating: number;
  user: { name: string };
  course: { title: string; instructor: { name: string } };
  createdAt: string;
  isHidden?: boolean;
}

const AdminReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    const fetchReviews = async () => {
      try {
        const res = await axiosInstance.get<Review[]>("/admin/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(res.data);
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchReviews();
  }, []);

  const handleHide = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    await axiosInstance.put(
      `/admin/reviews/${id}/hide`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setReviews((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isHidden: true } : r))
    );
  };

  const handleUnhide = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    await axiosInstance.put(
      `/admin/reviews/${id}/unhide`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setReviews((prev) =>
      prev.map((r) => (r._id === id ? { ...r, isHidden: false } : r))
    );
  };

  const handleDelete = async (id: string) => {
    const token = localStorage.getItem("adminToken");
    await axiosInstance.delete(`/admin/reviews/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setReviews((prev) => prev.filter((r) => r._id !== id));
  };

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        All Course Reviews
      </h1>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Instructor
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Rating
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Review
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {r.course.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {r.course.instructor.name}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-1">
                      <span className="text-sm font-medium text-gray-900">
                        {r.rating}
                      </span>
                      <span className="text-yellow-400 text-lg">★</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700 max-w-xs">
                    <div className="truncate" title={r.text}>
                      {r.text}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {r.user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(r.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center space-x-2">
                      {r.isHidden ? (
                        <button
                          onClick={() => handleUnhide(r._id)}
                          className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 text-xs rounded transition-colors"
                        >
                          Unhide
                        </button>
                      ) : (
                        <button
                          onClick={() => handleHide(r._id)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 text-xs rounded transition-colors"
                        >
                          Hide
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(r._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs rounded transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {reviews.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No reviews available</p>
            <p className="text-gray-400 text-sm mt-1">
              Course reviews will appear here when available
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminReviews;
