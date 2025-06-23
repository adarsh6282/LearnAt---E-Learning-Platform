import { useEffect, useState } from "react";
import axiosInstance from "../../services/apiService";

interface Review {
  _id: string;
  text: string;
  rating: number;
  user: { name: string };
  course: { title: string };
  createdAt: string;
}

const InstructorReview = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);

  useEffect(() => {
    const fetchReviews = async () => {
      const token = localStorage.getItem("instructorsToken");

      try {
        const res = await axiosInstance.get<Review[]>("/instructors/reviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setReviews(res.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
      }
    };

    fetchReviews();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Your Course Reviews
      </h1>

      {/* Filter */}
      <div className="mb-4 flex items-center space-x-4">
        <label className="text-sm font-medium text-gray-700">
          Filter
        </label>
        <select
          value={ratingFilter ?? ""}
          onChange={(e) =>
            setRatingFilter(e.target.value ? parseInt(e.target.value) : null)
          }
          className="border border-gray-300 rounded px-3 py-1 text-sm"
        >
          <option value="">All</option>
          {[5, 4, 3, 2, 1].map((rating) => (
            <option key={rating} value={rating}>
              {rating} ★
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
                <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">Rating</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Review</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {reviews
                .filter((r) => (ratingFilter ? r.rating === ratingFilter : true))
                .map((r) => (
                  <tr key={r._id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {r.course.title}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <span className="text-sm font-medium text-gray-900">{r.rating}</span>
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
            <p className="text-gray-500 text-lg">No reviews yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Reviews from your students will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorReview;
