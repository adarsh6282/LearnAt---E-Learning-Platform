import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Search, Filter, Star, Users, Clock, BookOpen } from "lucide-react";
import Navbar from "../../components/Navbar";
import type { Course, SortOption } from "../../types/user.types";
import { getCoursesS } from "../../services/user.services";
import { USER_ROUTES } from "../../constants/routes.constants";
import Pagination from "../../components/Pagination";

const Courses: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 2;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [sortBy, setSortBy] = useState<SortOption>("title");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const res = await getCoursesS();
        setCourses(res.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const categories = useMemo(() => {
    const allCategories = courses.map((course) => course.category);
    const validCategories = allCategories.filter(Boolean);
    return Array.from(new Set(validCategories));
  }, [courses]);

  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courses.filter((course) => {
      if (course.isActive === false) return false;
      const matchesSearch = course.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "all" || course.category === selectedCategory;
      const matchesPrice =
        course.price >= priceRange[0] && course.price <= priceRange[1];
      return matchesSearch && matchesCategory && matchesPrice;
    });

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "title":
          return a.title.localeCompare(b.title);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        case "rating":
          return (b.rating || 0) - (a.rating || 0);
        default:
          return 0;
      }
    });

    return filtered;
  }, [courses, searchTerm, selectedCategory, priceRange, sortBy]);

  const paginatedCourses = useMemo(() => {
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    return filteredAndSortedCourses.slice(indexOfFirstItem, indexOfLastItem);
  }, [filteredAndSortedCourses, currentPage]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredAndSortedCourses.length / itemsPerPage);
  }, [filteredAndSortedCourses]);

  const maxPrice = useMemo(() => {
    return Math.max(...courses.map((course) => course.price), 10000);
  }, [courses]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100">
        <Navbar />
        <div className="pt-32 max-w-4xl mx-auto px-4">
          <div className="animate-pulse space-y-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-slate-900/80 p-6 shadow" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar />
      <div className="pt-5 pb-8 max-w-6xl mx-auto px-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-10">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-cyan-400 via-fuchsia-500 to-indigo-600 bg-clip-text text-transparent mb-1">
              Explore Courses
            </h1>
            <p className="text-slate-400 text-sm">
              {filteredAndSortedCourses.length} courses available
            </p>
          </div>
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="sm:hidden flex items-center gap-2 px-3 py-2 rounded-full bg-slate-900/80 border border-cyan-400/20 text-cyan-300 mt-4 sm:mt-0"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          <div className={`md:w-1/3 ${showFilters ? "" : "hidden md:block"}`}>
            <div className="bg-white/5 backdrop-blur-md rounded-2xl shadow p-6 space-y-6 border border-cyan-400/10">
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  <span className="flex items-center gap-2">
                    <Search className="h-4 w-4 text-cyan-400" />
                    Search
                  </span>
                </label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Title or instructor"
                  className="w-full px-3 py-2 bg-slate-900/80 text-slate-100 border border-cyan-400/10 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Category
                </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-900/80 text-slate-100 border border-cyan-400/10 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                >
                  <option value="all">All Categories</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Price Range: <span className="text-cyan-400">₹{priceRange[0]} - ₹{priceRange[1]}</span>
                </label>
                <div className="flex gap-2 items-center">
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[0]}
                    onChange={(e) =>
                      setPriceRange([parseInt(e.target.value), priceRange[1]])
                    }
                    className="w-full accent-cyan-500"
                  />
                  <input
                    type="range"
                    min="0"
                    max={maxPrice}
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([priceRange[0], parseInt(e.target.value)])
                    }
                    className="w-full accent-fuchsia-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-200 mb-1">
                  Sort By
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as SortOption)}
                  className="w-full px-3 py-2 bg-slate-900/80 text-slate-100 border border-cyan-400/10 rounded-md focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
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
                  setSelectedCategory("all");
                  setPriceRange([0, maxPrice]);
                  setSortBy("title");
                }}
                className="w-full py-2 mt-2 bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white rounded-full font-semibold hover:scale-105 transition-all duration-300"
              >
                Clear All
              </button>
            </div>
          </div>

          <div className="md:w-2/3">
            {filteredAndSortedCourses.length === 0 ? (
              <div className="text-center py-12">
                <BookOpen className="mx-auto h-12 w-12 text-cyan-400" />
                <h3 className="mt-2 text-lg font-bold text-slate-200">
                  No courses found
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  Try adjusting your search criteria.
                </p>
              </div>
            ) : (
              <div className="space-y-8">
                {paginatedCourses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white/5 backdrop-blur-md rounded-2xl shadow hover:shadow-lg transition-shadow duration-300 flex flex-col md:flex-row border border-cyan-400/10"
                  >
                    <div className="md:w-48 w-full flex-shrink-0">
                      <img
                        src={`${course.thumbnail}?v=${Date.now()}`}
                        alt={course.title}
                        className="object-cover w-full h-40 md:h-full rounded-t-2xl md:rounded-l-2xl md:rounded-t-none"
                      />
                    </div>
                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-xl font-bold text-cyan-300 mb-1 line-clamp-2">
                          {course.title}
                        </h3>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-400 mb-2">
                          {course.rating && (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-current" />
                              <span className="ml-1">{course.rating}</span>
                            </div>
                          )}
                          {course.studentsCount && (
                            <div className="flex items-center">
                              <Users className="h-4 w-4" />
                              <span className="ml-1">
                                {course.studentsCount}
                              </span>
                            </div>
                          )}
                          {course.duration && (
                            <div className="flex items-center">
                              <Clock className="h-4 w-4" />
                              <span className="ml-1">{course.duration}</span>
                            </div>
                          )}
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="text-lg font-bold text-fuchsia-400">
                            ₹{course.price}
                          </span>
                          {course.level && (
                            <span className="px-2 py-1 bg-cyan-100 text-cyan-800 text-xs rounded-full">
                              {course.level}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <Link
                          to={USER_ROUTES.COURSE_DETAIL(course._id)}
                          className="inline-flex items-center px-5 py-2 bg-gradient-to-r from-cyan-500 to-fuchsia-600 text-white text-base font-semibold rounded-full shadow hover:scale-105 transition-all duration-300"
                        >
                          View Course
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-8">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={(page) => setCurrentPage(page)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
