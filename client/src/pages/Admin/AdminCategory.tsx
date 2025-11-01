import { useCallback, useEffect, useState } from "react";
import BeatLoader from "react-spinners/BeatLoader";
import { errorToast, successToast } from "../../components/Toast";
import {
  getAllCategoriesS,
  softDeleteCategoryS,
  restoreCategoryS,
  addCategoryS,
} from "../../services/category.services";
import type { Category } from "../../types/category.types";
import Pagination from "../../components/Pagination";
import { useSearchParams } from "react-router-dom";
import type { AxiosError } from "axios";

const AdminCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const pageParam = parseInt(searchParams.get("page") || "1");
  const [currentPage, setCurrentPage] = useState<number>(pageParam);
  const itemsPerPage = 1;
  const [totalPages, setTotalPages] = useState<number>(1);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [debounce, setDebounce] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebounce(searchTerm);
    }, 300);

    return () => clearTimeout(timeout);
  }, [searchTerm]);

  useEffect(() => {
    const pageParam = parseInt(searchParams.get("page") || "1");
    setCurrentPage(pageParam);
  }, [searchParams]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    setSearchParams({ page: page.toString() });
  };

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      errorToast("Category name cannot be empty");
      return;
    }
    if(newCategoryName.length>15){
      errorToast("Category name cannot exceed 15 characters")
      return;
    }
    try {
      const response = await addCategoryS({ name: newCategoryName });
      successToast(response.message);
      setShowModal(false);
      setNewCategoryName("");
      fetchCategories();
    } catch (err: unknown) {
      console.log(err);
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    }
  };

  const fetchCategories = useCallback( async () => {
    try {
      const all = await getAllCategoriesS(
        currentPage,
        itemsPerPage,
        debounce,
        selectedStatus
      );
      setCategories(all.category);
      setTotalPages(all.totalPages);
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    } finally {
      setLoading(false);
    }
  },[currentPage,itemsPerPage,debounce,selectedStatus])

   useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  const handleSoftDelete = async (id: string) => {
    try {
      const response = await softDeleteCategoryS(id);
      successToast(response.message);
      fetchCategories();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await restoreCategoryS(id);
      successToast(response.message);
      fetchCategories();
    } catch (err: unknown) {
      const error = err as AxiosError<{ message: string }>;
      errorToast(error.response?.data?.message ?? "Something went wrong");
    }
  };

  return loading ? (
    <div className="flex justify-center items-center h-screen">
      <BeatLoader color="#7e22ce" size={30} />
    </div>
  ) : (
    <div className="h-full bg-gray-50 flex flex-col">
      <div className="max-w-4xl mx-auto w-full flex flex-col h-full">
        <div className="flex-shrink-0 p-6 pb-0">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Category Management
          </h2>

          <div className="flex flex-wrap gap-4 mb-6">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2 w-64"
            />

            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-slate-300 rounded-md px-3 py-2"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>

            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              + Add Category
            </button>
          </div>
        </div>

        <div className="flex-1 px-6 pb-6 flex flex-col">
          <div className="border border-gray-200 rounded-lg bg-white p-4">
            {categories.length === 0 ? (
              <p className="text-gray-500">No categories found.</p>
            ) : (
              <div className="space-y-4">
                {categories.map((category) => (
                  <div
                    key={category._id}
                    className={`p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center ${
                      category.isDeleted ? "bg-red-50" : "bg-gray-50"
                    }`}
                  >
                    <h4 className="text-lg font-semibold text-gray-800">
                      {category.name}
                    </h4>
                    {category.isDeleted ? (
                      <button
                        onClick={() => handleRestore(category._id)}
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      >
                        Restore
                      </button>
                    ) : (
                      <button
                        onClick={() => handleSoftDelete(category._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">
              Add New Category
            </h2>
            <input
              type="text"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Enter category name"
              className="w-full border border-gray-300 rounded p-2 mb-4 text-sm"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Add
              </button>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewCategoryName("");
                }}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <Pagination
        currentPage={currentPage}
        onPageChange={handlePageChange}
        totalPages={totalPages}
      />
    </div>
  );
};

export default AdminCategory;
