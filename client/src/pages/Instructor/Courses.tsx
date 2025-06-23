import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { ICourse } from "../../types/course.types";
import { getInstructorCoursesS } from "../../services/instructor.services";
import Pagination from "../../components/Pagination";

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 6;
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const token = localStorage.getItem("instructorsToken");

  if (!token) return;

  useEffect(() => {
    const fetchInstructorCourses = async () => {
      try {
        setLoading(true);
        const res = await getInstructorCoursesS(token);

        setCourses(res.data);
      } catch (err: any) {
        setError("Failed to load courses");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInstructorCourses();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <p className="text-red-500">{error}</p>;

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentCourses = courses.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(courses.length / itemsPerPage);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Courses</h1>

      {courses.length === 0 ? (
        <p className="text-gray-600">You haven't created any courses yet.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentCourses.map((course) => (
              <Link
                to={`/instructors/courses/${course._id}`}
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
              onPageChange={(page) => setCurrentPage(page)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default Courses;
