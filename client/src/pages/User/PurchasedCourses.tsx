import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "../../components/Pagination";
import { getPurchasedCoursesS } from "../../services/user.services";
import { LibraryBig, PlayCircle } from "lucide-react";

interface PurchasedCourse {
  _id: string;
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
        const res = await getPurchasedCoursesS(currentPage, itemsPerPage);
        setCourses(res.data.purchasedCourses);
        setTotalPages(res.data.totalPages);
      } catch (error) {
        console.log(error);
      }
    };
    fetchPurchasedCourses();
  }, [currentPage, itemsPerPage]);

  return (
    <div className="w-full">
      <div className="flex items-center gap-3 mb-8">
        <LibraryBig className="text-green-400" size={24} />
        <h2 className="font-subtext text-3xl font-bold text-white">
          My{" "}
          <span className="font-ornate text-green-400 font-black italic">Courses</span>
        </h2>
      </div>

      {courses.length === 0 ? (
        <div className="text-center py-16 bg-black/20 rounded-2xl border border-white/5">
          <LibraryBig className="mx-auto h-12 w-12 text-green-400 mb-4" />
          <h3 className="mt-2 text-xl font-bold text-white">No courses purchased yet</h3>
          <p className="mt-1 text-sm text-neutral-400">Explore our catalog to start learning today.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/users/courses/${course._id}`)}
              className="group bg-white/5 backdrop-blur rounded-2xl ring-1 ring-white/10 hover:ring-green-500/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden flex flex-col"
            >
              <div className="relative h-40 overflow-hidden">
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <span className="absolute bottom-3 left-3 text-xs text-neutral-200 bg-black/50 backdrop-blur px-2.5 py-1 rounded-full ring-1 ring-white/10">
                  {new Date(course.purchasedAt).toLocaleDateString()}
                </span>
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-lg font-bold text-white mb-2 line-clamp-1 group-hover:text-green-400 transition-colors">
                  {course.title}
                </h3>
                <p className="text-sm text-neutral-400 mb-4 line-clamp-2 flex-1">
                  {course.description}
                </p>

                <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                  <span className="text-sm font-semibold text-neutral-300 inline-flex items-center gap-1.5">
                    <PlayCircle size={16} className="text-green-400" />
                    Start Watching
                  </span>
                  <span className="text-lg font-extrabold text-white">
                    ₹{course.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center">
          <Pagination
            currentPage={currentPage}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </div>
      )}
    </div>
  );
}