import axiosInstance from "./apiService";
import type { CategoryResponse, Category } from "../types/category.types";

export const getAllCategoriesS = async ():Promise<Category[]> => {
  const res = await axiosInstance.get("/admin/category",{headers:{Authorization:`Bearer ${localStorage.getItem("adminToken")}`}});
  return res.data as Category[];
};

export const softDeleteCategoryS = async (id: string) => {
  const res=await axiosInstance.patch<CategoryResponse>(`/admin/category/delete/${id}`,{},{headers:{Authorization:`Bearer ${localStorage.getItem("adminToken")}`}});
  return res.data
};

export const restoreCategoryS = async (id: string) => {
  const res=await axiosInstance.patch<CategoryResponse>(`/admin/category/restore/${id}`,{},{headers:{Authorization:`Bearer ${localStorage.getItem("adminToken")}`}});
  return res.data
};

export const addCategoryS = async (category: { name: string }) => {
  const res = await axiosInstance.post<CategoryResponse>("/admin/category", category,{headers:{Authorization:`Bearer ${localStorage.getItem("adminToken")}`}});
  return res.data;
};