import type { CategoryResponse, Category } from "../types/category.types";
import adminApi from "./adminApiService";

export const getAllCategoriesS = async ():Promise<Category[]> => {
  const res = await adminApi.get("/admin/category");
  return res.data as Category[];
};

export const softDeleteCategoryS = async (id: string) => {
  const res=await adminApi.patch<CategoryResponse>(`/admin/category/delete/${id}`,{});
  return res.data
};

export const restoreCategoryS = async (id: string) => {
  const res=await adminApi.patch<CategoryResponse>(`/admin/category/restore/${id}`,{});
  return res.data
};

export const addCategoryS = async (category: { name: string }) => {
  const res = await adminApi.post<CategoryResponse>("/admin/category", category);
  return res.data;
};