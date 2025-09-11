import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import type { ICourse } from "../../types/course.types";
import { getInstructorCoursesS } from "../../services/instructor.services";
import Pagination from "../../components/Pagination";
import { INSTRUCTOR_ROUTES } from "../../constants/routes.constants";

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [totalPages, setTotalPages] = useState<number>(1);
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 3;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [debounce, setDebounce] = useState<string>("");
  const token = localStorage.getItem("instructorsToken");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(searchQuery);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQuery]);

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setLoading(true);
        const res = await getInstructorCoursesS(
          currentPage,
          itemsPerPage,
          debounce
        );
        setCourses(res.data.courses);
        setTotalPages(res.data.totalPages);
      } catch (err) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, [currentPage, itemsPerPage, debounce]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParams]);

  if (!token) return;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>

      <div className="mb-6 max-w-md">
        <input
          type="text"
          placeholder="Search by course title"
          value={searchQuery}
          onKeyDown={(e) => {
            if (e.repeat) e.preventDefault();
          }}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-2 border border-slate-600 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {courses.length === 0 ? (
        <p className="text-gray-600">You haven't created any courses yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <Link
                to={INSTRUCTOR_ROUTES.EDIT_COURSE(course._id)}
                key={course._id}
                className="border p-4 rounded shadow hover:shadow-lg transition"
              >
                <img
                  src={course.thumbnail || "/default-thumbnail.jpg"}
                  alt={course.title}
                  className="w-full h-40 object-cover rounded mb-2"
                />
                <h2 className="text-lg font-semibold">{course.title}</h2>
                <p className="text-sm text-gray-500 mb-1">
                  Category: {course.category || "Uncategorized"}
                </p>
                <p className="text-sm text-gray-500 mb-1">
                  Lectures: {course.lectures?.length || 0}
                </p>
                <p className="text-sm text-gray-700 font-medium">
                  ₹{course.price?.toFixed(2) || "Free"}
                </p>
                <p className="mt-2 text-sm text-blue-600">View Details →</p>
              </Link>
            ))}
          </div>

          {courses.length && itemsPerPage && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Courses;
