import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { getPurchasedCoursesS } from "../../services/user.services";

interface PurchasedCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  purchasedAt: string;
  thumbnail: string;
}

export default function PurchasedCourses() {
  const [courses, setCourses] = useState<PurchasedCourse[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [totalPages, setTotalPages] = useState<number>(1);
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 3;
  const navigate = useNavigate();

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  useEffect(() => {
    const fetchPurchasedCourses = async () => {
      try {
        const res = await getPurchasedCoursesS(currentPage,itemsPerPage)
        setCourses(res.data.purchasedCourses);
        console.log(res.data.purchasedCourses)
        setTotalPages(res.data.totalPages)
      } catch (error) {
        console.log(error);
      }
    };
    fetchPurchasedCourses();
  }, [currentPage,itemsPerPage]);

  return (
    <div className="min-h-full bg-slate-950 text-slate-100 relative overflow-x-hidden">
      <div className="max-w-5xl mx-auto py-16 px-4 relative z-10">
        <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
          My Purchased Courses
        </h1>
        {courses.length === 0 ? (
          <p className="text-slate-400">
            You have not purchased any courses yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div
                key={course.id}
                onClick={() => navigate(`/users/courses/${course.id}`)}
                className="bg-white/5 backdrop-blur-md rounded-2xl shadow-lg p-4 hover:scale-105 hover:shadow-xl transition cursor-pointer"
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="rounded-xl mb-3 w-full h-40 object-cover border border-cyan-400/10"
                />
                <h2 className="text-lg font-bold mb-1 bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                  {course.title}
                </h2>
                <p className="text-slate-300 text-sm mb-2 line-clamp-2">
                  {course.description}
                </p>
                <p className="font-bold mb-2 text-fuchsia-400">
                  ₹{course.price}
                </p>
                <p className="text-xs text-slate-400">
                  Purchased on{" "}
                  {new Date(course.purchasedAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}

        <style>
          {`
          @keyframes blob1 {
            0%, 100% { transform: translateY(0) scale(1);}
            50% { transform: translateY(-30px) scale(1.1);}
          }
          .animate-blob1 { animation: blob1 12s ease-in-out infinite; }
          @keyframes blob2 {
            0%, 100% { transform: translateY(0) scale(1);}
            50% { transform: translateY(30px) scale(1.1);}
          }
          .animate-blob2 { animation: blob2 14s ease-in-out infinite; }
          `}
        </style>
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
      </div>
    </div>
  );
}
