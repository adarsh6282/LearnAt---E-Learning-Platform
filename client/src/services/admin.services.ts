import adminApi from "./adminApiService";
import type { User } from "../types/user.types";
import type { Tutor } from "../types/instructor.types";
import type { ICourse } from "../types/course.types";
import type { DashboardData } from "../types/admin.types";
import type { AdminLoginResponse } from "../types/admin.types";

interface Message {
  message: string;
}

export const getTutorsS = async (
  page: number,
  limit: number,
  searchQuery: string
): Promise<{ tutors: Tutor[]; total: number; totalPages: number }> => {
  const response = await adminApi.get<{
    tutors: Tutor[];
    total: number;
    totalPages: number;
  }>("/admin/tutors", {
    params: {
      page,
      limit,
      isVerified: true,
      search: searchQuery.trim(),
    },
  });
  return response.data;
};

export const toggleTutorBlockS = async (email: string, isBlocked: boolean) => {
  return await adminApi.put(`/admin/tutors/block/${email}`, {
    blocked: !isBlocked,
  });
};

export const getUsersS = async (
  page: number,
  limit: number,
  searchQuery: string
) => {
  return await adminApi.get<{
    users: User[];
    total: number;
    totalPages: number;
  }>(`/admin/users?page=${page}&limit=${limit}`, {
    params: { search: searchQuery?.trim() },
  });
};

export const toggleUserBlockS = async (email: string, isBlocked: boolean) => {
  return await adminApi.put(`/admin/users/block/${email}`, {
    blocked: !isBlocked,
  });
};

export const getRequestsS = async (page: number, limit: number) => {
  const res = await adminApi.get<{
    tutors: Tutor[];
    total: number;
    totalPages: number;
  }>(`/admin/tutors`, {
    params: {
      page,
      limit,
      isVerified: false,
    },
  });
  return res.data;
};

export const handleAcceptS = async (email: string) => {
  return await adminApi.put(`/admin/tutors/verify`, { email });
};

export const handleRejectS = async (email: string, reason: string) => {
  return await adminApi.delete(`/admin/tutors/reject/${email}`, {
    data: { reason },
  } as any);
};

export const getCoursesS = async () => {
  return await adminApi.get<ICourse[]>("/admin/courses");
};

export const handleSoftDeleteS = async (id: string) => {
  return await adminApi.put<Message>(`/admin/courses/${id}`, {});
};

export const handleRestoreS = async (id: string) => {
  return await adminApi.put<Message>(`/admin/courses/recover/${id}`, {});
};

export const getDashboardS = async () => {
  return await adminApi.get<DashboardData>("/admin/dashboard");
};

export const adminLoginS = async (formData: {
  email: string;
  password: string;
}) => {
  return adminApi.post<AdminLoginResponse>("/admin/login", formData);
};