import adminApi from "./adminApiService";
import type { User } from "../types/user.types";
import type { Tutor } from "../types/instructor.types";
import type { ICourse } from "../types/course.types";
import type { DashboardData } from "../types/admin.types";
import type { AdminLoginResponse } from "../types/admin.types";
import type { CourseViewType } from "../types/user.types";

interface Message {
  message: string;
}

interface Complaint {
  _id: string;
  type: "report" | "complaint";
  subject: string;
  message: string;
  status: "pending" | "resolved" | "rejected";
  response: string;
  userId: { name: string; email: string };
  targetId?: { _id: string; title: string };
  createdAt: string;
}

interface Review {
  _id: string;
  text: string;
  rating: number;
  user: { name: string };
  course: { title: string; instructor: { name: string } };
  createdAt: string;
  isHidden?: boolean;
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

export const getCoursesS = async (
  page: number,
  limit: number,
  searchQuery: string
) => {
  return await adminApi.get<{
    course: ICourse[];
    total: number;
    totalPage: number;
  }>(`/admin/courses?page=${page}&limit=${limit}`, {
    params: { search: searchQuery?.trim() },
  });
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

export const adminCourseChartS = async () => {
  return await adminApi.get<{ title: string; enrolledCount: number }[]>(
    "/admin/course-status"
  );
};

export const adminIncomeChartS = async () => {
  return await adminApi.get<{ month: string; revenue: number }[]>(
    "/admin/income-status"
  );
};

export const adminLogoutS = async () => {
  return await adminApi.post("/admin/logout", {});
};

export const getComplaintsS = async (
  page: number,
  limit: number,
  search: string,
  status: string
) => {
  return await adminApi.get<{
    complaints: Complaint[];
    totalPages: number;
  }>(
    `/admin/complaints?page=${page}&limit=${limit}&search=${search}&status=${status}`
  );
};

export const AdminCourseViewS = async (courseId: string) => {
  return await adminApi.get<CourseViewType>(`/admin/courses/${courseId}`);
};

export const getReviewForAdminS = async (
  page: number,
  limit: number,
  search: string,
  rating: number,
  sort?: string
) => {
  return await adminApi.get<{
    reviews: Review[];
    total: number;
    totalPages: number;
  }>(
    `/admin/reviews?page=${page}&limit=${limit}&search=${search}&rating=${rating}&sort=${sort}`
  );
};

export const hideReviewS = async (id: string) => {
  return await adminApi.put(`/admin/reviews/${id}/hide`, {});
};

export const unHideReviewS = async (id: string) => {
  return await adminApi.put(`/admin/reviews/${id}/unhide`, {});
};

export const deleteReviewS = async (id: string) => {
  return await adminApi.delete(`/admin/reviews/${id}`);
};
