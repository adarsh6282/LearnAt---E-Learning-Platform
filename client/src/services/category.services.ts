import type { CategoryResponse, Category } from "../types/category.types";
import adminApi from "./adminApiService";

export const getAllCategoriesS = async (
  page: number,
  limit: number,
  search:string,
  status:string
): Promise<{ category: Category[]; total: number; totalPages: number }> => {
  const res = await adminApi.get<{
    category: Category[];
    total: number;
    totalPages: number;
  }>(`/admin/category?page=${page}&limit=${limit}&search=${search}&status=${status}`);

  return res.data;
};

export const softDeleteCategoryS = async (id: string) => {
  const res = await adminApi.patch<CategoryResponse>(
    `/admin/category/delete/${id}`,
    {}
  );
  return res.data;
};

export const restoreCategoryS = async (id: string) => {
  const res = await adminApi.patch<CategoryResponse>(
    `/admin/category/restore/${id}`,
    {}
  );
  return res.data;
};

export const addCategoryS = async (category: { name: string }) => {
  const res = await adminApi.post<CategoryResponse>(
    "/admin/category",
    category
  );
  return res.data;
};
