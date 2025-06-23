import { useEffect, useState } from "react";
import axiosInstance from "../../services/apiService";

interface Enrollment {
  _id: string;
  course: { title: string };
  user: { name: string; email: string };
  createdAt: string;
}

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);

  useEffect(() => {
    const token = localStorage.getItem("instructorsToken");
    axiosInstance
      .get<Enrollment[]>("/instructors/enrollments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setEnrollments(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Course Enrollments
      </h1>

      {/* Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Course</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Student</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Email</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enrollments.map((enroll) => (
                <tr key={enroll._id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {enroll.course.title}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {enroll.user.name}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {enroll.user.email}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(enroll.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {enrollments.length === 0 && (
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
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">No enrollments yet</p>
            <p className="text-gray-400 text-sm mt-1">
              Student enrollments will appear here
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Enrollments;