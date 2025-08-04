import { useEffect, useState } from "react";
import axiosInstance from "../../services/apiService";
import adminApi from "../../services/adminApiService";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";

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
  const [searchQuery, setSearchQuery] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageParam = parseInt(searchParams.get("page") || "1");
  const itemsPerPage = 6;
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const [filteredReview, setFilteredReview] = useState<Review[]>([]);
  const [sortOption, setSortOption] = useState("date");
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await adminApi.get<{
          reviews: Review[];
          total: number;
          totalPages: number;
        }>(`/admin/reviews?page=${currentPage}&limit=${itemsPerPage}`);
        setReviews(res.data.reviews);
        setFilteredReview(res.data.reviews);
        setTotalPages(res.data.totalPages);
      } catch (err: any) {
        console.log(err);
      }
    };
    fetchReviews();
  }, [currentPage, itemsPerPage]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

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

  useEffect(() => {
    const filtered = reviews.filter(
      (review) =>
        review.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        review.course.instructor.name
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        review.text.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (ratingFilter !== null) {
      filtered.filter((r) => r.rating == ratingFilter);
    }

    switch (sortOption) {
      case "oldest":
        filtered.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
        break;
      case "ratingHigh":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "ratingLow":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      default:
        filtered.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
    }
    setFilteredReview(filtered);
  }, [searchQuery, reviews, sortOption, ratingFilter]);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        All Course Reviews
      </h1>

      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by course title or instructor..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <select
          className="px-3 py-2 border rounded"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <option value="date">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="ratingHigh">Rating: High to Low</option>
          <option value="ratingLow">Rating: Low to High</option>
        </select>

        <select
          className="px-3 py-2 border rounded"
          value={ratingFilter ?? ""}
          onChange={(e) =>
            setRatingFilter(e.target.value ? parseInt(e.target.value) : null)
          }
        >
          <option value="">All</option>
          <option value="5">5★</option>
          <option value="4">4★</option>
          <option value="3">3★</option>
          <option value="2">2★</option>
          <option value="1">1★</option>
        </select>
      </div>

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
              {filteredReview.map((r) => (
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
      {reviews.length && itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default AdminReviews;
