import { useEffect, useState } from "react";
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

const AdminCategory = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [activePage, setActivePage] = useState(1);
  const [deletedPage, setDeletedPage] = useState(1);
  const itemsPerPage = 2;
  const [showModal, setShowModal] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAddCategory = async () => {
    if (!newCategoryName.trim()) {
      errorToast("Category name cannot be empty");
      return;
    }
    try {
      const response = await addCategoryS({ name: newCategoryName });
      successToast(response.message);
      setShowModal(false);
      setNewCategoryName("");
      fetchCategories();
    } catch (err: any) {
      errorToast(err.response?.data?.message || "Failed to add category");
    }
  };

  const fetchCategories = async () => {
    try {
      const all = await getAllCategoriesS();
      setCategories(all);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Failed to fetch categories";
      errorToast(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleSoftDelete = async (id: string) => {
    try {
      const response = await softDeleteCategoryS(id);
      successToast(response.message);
      fetchCategories();
    } catch (err: any) {
      errorToast(err.response?.data?.message);
    }
  };

  const handleRestore = async (id: string) => {
    try {
      const response = await restoreCategoryS(id);
      successToast(response.message);
      fetchCategories();
    } catch (err: any) {
      errorToast(err.response?.data?.message);
    }
  };

  const activeCategories = categories.filter((c) => !c.isDeleted);
  const totalActivePages = Math.ceil(activeCategories.length / itemsPerPage);

  const paginatedActiveCategories = activeCategories.slice(
    (activePage - 1) * itemsPerPage,
    activePage * itemsPerPage
  );

  const deletedCategories = categories.filter((c) => c.isDeleted);
  const totalDeletedPages = Math.ceil(deletedCategories.length / itemsPerPage);

  const paginatedDeletedCategories = deletedCategories.slice(
    (deletedPage - 1) * itemsPerPage,
    deletedPage * itemsPerPage
  );

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

          <div className="mb-6 flex justify-end">
            <button
              onClick={() => setShowModal(true)}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700"
            >
              + Add Category
            </button>
          </div>
        </div>

        <div className="flex-1 px-6 pb-6 flex flex-col">
          <section className="mb-8 flex flex-col">
            <h3 className="text-xl font-semibold text-green-700 mb-3">
              Active Categories
            </h3>
            <div className="border border-gray-200 rounded-lg bg-white p-4">
              {activeCategories.length === 0 ? (
                <p className="text-gray-500">No active categories.</p>
              ) : (
                <div className="space-y-4">
                  {paginatedActiveCategories.map((category) => (
                    <div
                      key={category._id}
                      className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {category.name}
                        </h4>
                      </div>
                      <button
                        onClick={() => handleSoftDelete(category._id)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  ))}
                  {totalActivePages && (
                    <Pagination
                      currentPage={activePage}
                      totalPages={totalActivePages}
                      onPageChange={setActivePage}
                    />
                  )}
                </div>
              )}
            </div>
          </section>

          <section className="flex flex-col">
            <h3 className="text-xl font-semibold text-red-700 mb-3">
              Deleted Categories
            </h3>
            <div className="border border-gray-200 rounded-lg bg-white p-4">
              {deletedCategories.length === 0 ? (
                <p className="text-gray-500">No deleted categories.</p>
              ) : (
                <div className="space-y-4">
                  {paginatedDeletedCategories.map((category) => (
                    <div
                      key={category._id}
                      className="bg-gray-50 p-4 rounded-lg shadow border border-gray-200 flex justify-between items-center"
                    >
                      <div>
                        <h4 className="text-lg font-semibold text-gray-800">
                          {category.name}
                        </h4>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleRestore(category._id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                          Restore
                        </button>
                      </div>
                    </div>
                  ))}
                  {totalDeletedPages > 1 && (
                    <Pagination
                      currentPage={deletedPage}
                      totalPages={totalDeletedPages}
                      onPageChange={setDeletedPage}
                    />
                  )}
                </div>
              )}
            </div>
          </section>
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
    </div>
  );
};

export default AdminCategory;
