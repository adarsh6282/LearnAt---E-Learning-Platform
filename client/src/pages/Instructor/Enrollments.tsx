import { useEffect, useState } from "react";
import instructorApi from "../../services/instructorApiService";
import { useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";

interface Enrollment {
  _id: string;
  course: { title: string };
  user: { name: string; email: string };
  isCompleted: boolean;
  createdAt: string;
}

const Enrollments = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 7;
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  useEffect(() => {
    const fetchEnrollments = async () => {
      const res=await instructorApi.get<{enrollments:Enrollment[],totalPages:number}>(`/instructors/enrollments?page=${currentPage}&limit=${itemsPerPage}`)
        setEnrollments(res.data.enrollments)
        setTotalPages(res.data.totalPages)
    };
    fetchEnrollments();
  }, [currentPage,itemsPerPage]);

  return (
    <div className="p-6 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Course Enrollments
      </h1>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Course
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Student
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Date
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {enrollments.map((enroll) => (
                <tr
                  key={enroll._id}
                  className="hover:bg-gray-50 transition-colors"
                >
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
                  <td
                    className={`px-6 py-4 text-sm text-gray-700 ${
                      enroll.isCompleted ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {enroll.isCompleted ? "Completed" : "InComplete"}
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
      <Pagination
          currentPage={currentPage}
          onPageChange={handlePageChange}
          totalPages={totalPages}
        />
    </div>
  );
};

export default Enrollments;
