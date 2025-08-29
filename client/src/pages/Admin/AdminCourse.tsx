import React, { useEffect, useState } from "react";
import { Trash2, User, AlertCircle, CheckCircle } from "lucide-react";
import {
  getCoursesS,
  handleRestoreS,
  handleSoftDeleteS,
} from "../../services/admin.services";
import type { ICourse } from "../../types/course.types";
import { errorToast, successToast } from "../../components/Toast";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";

const AdminCourse: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debounce, setDebounce] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 4;
  const [totalPages, setTotalPages] = useState<number>(1);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    const search = searchParams.get("search") || "";
    setCurrentPage(pageParam);
    setSearchQuery(search);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString(), search: searchQuery.trim() });
  };

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await getCoursesS(currentPage, itemsPerPage, debounce);
      setCourses(res.data.course);
      setTotalPages(res.data.totalPage);
    } catch (err: any) {
      console.error("Failed to fetch courses:", err);
      errorToast(err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      const response = await handleSoftDeleteS(id);
      successToast(response.data.message);
      fetchCourses();
    } catch (err) {
      console.error("Soft delete failed", err);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await handleRestoreS(id);
      successToast(response.data.message);
      fetchCourses();
    } catch (err) {
      console.error("Restore failed", err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [currentPage, itemsPerPage, debounce]);

  return (
    <div className="min-h-full bg-gradient-to-br from-slate-50 to-slate-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-800 mb-2">
            Admin Course Management
          </h2>
          <p className="text-slate-600">
            Manage and monitor all courses in your platform
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <div className="flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg text-slate-600">Loading courses...</span>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && courses.length === 0 && (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-sm p-12">
              <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="h-8 w-8 text-slate-400" />
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">
                No courses found
              </h3>
              <p className="text-slate-600">
                There are no courses available at the moment.
              </p>
            </div>
          </div>
        )}

        <div className="mb-6 max-w-md">
          <input
            type="text"
            placeholder="Search by course title or instructor..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Courses Table */}
        {!loading && courses.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Course Title
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Instructor
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Status
                    </th>
                    <th className="text-left py-4 px-6 font-semibold text-slate-700">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {courses.map((course, index) => (
                    <tr
                      key={course._id}
                      className={`border-b border-slate-100 hover:bg-slate-50 transition-colors duration-200 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-25"
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="font-medium text-slate-900">
                          {course.title}
                        </div>
                        {course.description && (
                          <div className="text-sm text-slate-500 mt-1">
                            {course.description.length > 60
                              ? `${course.description.substring(0, 60)}...`
                              : course.description}
                          </div>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {(course.instructor?.name || "U")
                                .charAt(0)
                                .toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <div className="font-medium text-slate-900">
                              {course.instructor?.name || "Unknown"}
                            </div>
                            {course.instructor?.email && (
                              <div className="text-sm text-slate-500">
                                {course.instructor.email}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        {!course.isActive ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800 border border-red-200">
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Deleted
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Active
                          </span>
                        )}
                      </td>
                      <td className="py-4 px-6">
                        {course.isActive ? (
                          <button
                            onClick={() => handleSoftDelete(course._id)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Soft Delete
                          </button>
                        ) : (
                          <button
                            onClick={() => handleRestore(course._id)}
                            className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white text-sm font-medium rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Restore
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default AdminCourse;
