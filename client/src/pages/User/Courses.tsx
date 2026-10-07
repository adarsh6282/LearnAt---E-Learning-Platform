import React, { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Search, Filter, Star, BookOpen, LibraryBig } from "lucide-react";
import Navbar from "../../components/Navbar";
import type { Course, SortOption } from "../../types/user.types";
import { getCoursesS } from "../../services/user.services";
import { USER_ROUTES } from "../../constants/routes.constants";
import Pagination from "../../components/Pagination";
import { getCategory } from "../../services/user.services";

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<string[]>([]);
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 2;
  const [total, setTotal] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [debounce, setDebounce] = useState({
    search: "",
    minPrice: 0,
    maxPrice: 10000,
  });
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce({
        search: searchTerm,
        minPrice: priceRange[0],
        maxPrice: priceRange[1],
      });
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchTerm, priceRange]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await getCoursesS(
          currentPage,
          itemsPerPage,
          debounce.search,
          selectedCategory,
          debounce.minPrice,
          debounce.maxPrice
        );
        setCourses(res.data.courses);
        setTotalPages(res.data.totalPages);
        setTotal(res.data.total);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, [currentPage, itemsPerPage, debounce, selectedCategory]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCategory();
        setCategories(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
            backgroundSize: "0.3cm 0.3cm",
          }}
        />
        <Navbar />
        <div className="pt-32 max-w-6xl mx-auto px-5 relative">
          <div className="animate-pulse space-y-8">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-48 rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 shadow"
              />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden relative">
      <div
        className="fixed inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)",
          backgroundSize: "0.3cm 0.3cm",
        }}
      />

      <Navbar />

      <div className="relative pt-5 pb-20 max-w-6xl mx-auto px-5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-12">
          <div>
            <h1 className="font-subtext text-4xl sm:text-5xl font-extrabold text-white mb-2">
              Explore{" "}
              <span className="font-ornate text-green-400 font-black italic drop-shadow-lg">
                Courses
              </span>
            </h1>
            <p className="font-description text-neutral-400 text-lg">
              {total} courses available to boost your career
            </p>
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="sm:hidden flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10 text-green-400 mt-4 sm:mt-0"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className={`md:w-1/3 ${showFilters ? "" : "hidden md:block"}`}>
            <div className="bg-white/5 backdrop-blur-md rounded-3xl shadow p-6 space-y-6 ring-1 ring-white/10 sticky top-24">
              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-green-400" />
                    Search
                  </span>
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.repeat) e.preventDefault();
                  }}
                  placeholder="Title or instructor"
                  className="w-full px-4 py-2 bg-black/40 text-white border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 bg-black/40 text-white border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all [&>option]:bg-black"
                >
                  <option value="">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Price Range:{" "}
                  <span className="text-green-400 font-bold">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max={10000}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-full accent-green-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full accent-green-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-200 mb-2">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-4 py-2 bg-black/40 text-white border border-white/10 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all [&>option]:bg-black"
                >
                  <option value="title">Title (A-Z)</option>
                  <option value="price-low">Price (Low to High)</option>
                  <option value="price-high">Price (High to Low)</option>
                  <option value="rating">Rating</option>
                </select>
              </div>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("");
                  setPriceRange([0, 10000]);
                  setSortBy("title");
                }}
                className="w-full py-2 mt-2 bg-white/5 hover:bg-white/10 text-white rounded-full font-semibold border border-white/10 hover:border-green-500/50 hover:text-green-400 transition-all duration-300"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="md:w-2/3">
            {courses.length === 0 ? (
              <div className="text-center py-20 bg-white/5 backdrop-blur ring-1 ring-white/10 rounded-3xl">
                <BookOpen className="mx-auto h-12 w-12 text-green-400" />
                <h3 className="mt-4 text-xl font-bold text-white">
                  No courses found
                </h3>
                <p className="mt-1 text-sm text-neutral-400">
                  Try adjusting your search criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="group relative bg-white/5 backdrop-blur-md rounded-3xl overflow-hidden flex flex-col md:flex-row ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-green-500/10"
                  >
                    <div className="md:w-2/5 w-full flex-shrink-0 relative overflow-hidden">
                      <img
                        src={course.thumbnail}
                        alt={course.title}
                        className="w-full h-65 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between relative">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                          {course.category && (
                            <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-full border border-green-500/20 uppercase tracking-wide">
                              {course.category}
                            </span>
                          )}
                        </div>

                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-green-400 transition-colors">
                          {course.title}
                        </h3>

                        <p className="text-neutral-400 text-sm mb-4 line-clamp-2">
                          {course.description}
                        </p>
                        
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= Math.round(course.rating ?? 0)
                                    ? "text-yellow-400 fill-yellow-400"
                                    : "text-gray-500"
                                }`}
                              />
                            ))}

                            <span className="ml-2 text-sm">
                              {course.rating?.toFixed(1) ?? "0.0"}
                            </span>
                          </div>
                      </div>

                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                        <span className="text-2xl font-extrabold text-white">
                          ₹{course.price}
                        </span>
                        <Link
                          to={USER_ROUTES.COURSE_DETAIL(course._id)}
                          className="group/btn relative inline-flex items-center justify-center py-2 px-6 text-sm font-semibold rounded-full overflow-hidden transition-all duration-300 ring-1 bg-white/5 text-neutral-300 ring-white/10 hover:ring-green-500/30 hover:-translate-y-0.5"
                        >
                          <span className="absolute inset-0 bg-green-500 transform -translate-x-full group-hover/btn:translate-x-0 transition-transform duration-500 ease-out"></span>
                          <span className="relative z-10 flex items-center gap-2 transition-colors duration-500 group-hover/btn:text-black">
                            <LibraryBig size={16} />
                            View Course
                          </span>
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-12">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;