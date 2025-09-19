import type { User } from "../types/user.types";
import type { Tutor } from "../types/instructor.types";
import type { ICourse } from "../types/course.types";
import type { DashboardData } from "../types/admin.types";
import type { AdminLoginResponse } from "../types/admin.types";
import type { CourseViewType } from "../types/user.types";
import type { INotification } from "../context/NotificationContext";
import { createApi } from "./newApiService";

const api=createApi("admin")

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
  const response = await api.get<{
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
  return await api.put(`/admin/tutors/block/${email}`, {
    blocked: !isBlocked,
  });
};

export const getUsersS = async (
  page: number,
  limit: number,
  searchQuery: string
) => {
  return await api.get<{
    users: User[];
    total: number;
    totalPages: number;
  }>(`/admin/users?page=${page}&limit=${limit}`, {
    params: { search: searchQuery?.trim() },
  });
};

export const toggleUserBlockS = async (email: string, isBlocked: boolean) => {
  return await api.put(`/admin/users/block/${email}`, {
    blocked: !isBlocked,
  });
};

export const getRequestsS = async (page: number, limit: number) => {
  const res = await api.get<{
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
  return await api.put(`/admin/tutors/verify`, { email });
};

export const handleRejectS = async (email: string, reason: string) => {
  return await api.delete(`/admin/tutors/reject/${email}`, {
    data: { reason },
  });
};

export const getCoursesS = async (
  page: number,
  limit: number,
  searchQuery: string
) => {
  return await api.get<{
    course: ICourse[];
    total: number;
    totalPage: number;
  }>(`/admin/courses?page=${page}&limit=${limit}`, {
    params: { search: searchQuery?.trim() },
  });
};

export const handleSoftDeleteS = async (id: string) => {
  return await api.put<Message>(`/admin/courses/${id}`, {});
};

export const handleRestoreS = async (id: string) => {
  return await api.put<Message>(`/admin/courses/recover/${id}`, {});
};

export const getDashboardS = async () => {
  return await api.get<DashboardData>("/admin/dashboard");
};

export const adminLoginS = async (formData: {
  email: string;
  password: string;
}) => {
  return api.post<AdminLoginResponse>("/admin/login", formData);
};

export const adminCourseChartS = async () => {
  return await api.get<{ title: string; enrolledCount: number }[]>(
    "/admin/course-status"
  );
};

export const adminIncomeChartS = async () => {
  return await api.get<{ month: string; revenue: number }[]>(
    "/admin/income-status"
  );
};

export const adminLogoutS = async () => {
  return await api.post("/admin/logout", {});
};

export const getComplaintsS = async (
  page: number,
  limit: number,
  search: string,
  status: string
) => {
  return await api.get<{
    complaints: Complaint[];
    totalPages: number;
  }>(
    `/admin/complaints?page=${page}&limit=${limit}&search=${search}&status=${status}`
  );
};

export const AdminCourseViewS = async (courseId: string) => {
  return await api.get<CourseViewType>(`/admin/courses/${courseId}`);
};

export const getReviewForAdminS = async (
  page: number,
  limit: number,
  search: string,
  rating: number|null,
  sort?: string
) => {
  return await api.get<{
    reviews: Review[];
    total: number;
    totalPages: number;
  }>(
    `/admin/reviews?page=${page}&limit=${limit}&search=${search}&rating=${rating}&sort=${sort}`
  );
};

export const hideReviewS = async (id: string) => {
  return await api.put(`/admin/reviews/${id}/hide`, {});
};

export const unHideReviewS = async (id: string) => {
  return await api.put(`/admin/reviews/${id}/unhide`, {});
};

export const deleteReviewS = async (id: string) => {
  return await api.delete(`/admin/reviews/${id}`);
};

export const getWalletS = async (page: number, limit: number) => {
  return await api.get<{
    transactions: [];
    balance: number;
    totalPages: number;
  }>(`/admin/wallet?page=${page}&limit=${limit}`);
};

export const adminNotification = async (userId: string) => {
  return await api.get<INotification[]>(`/admin/notifications/${userId}`);
};

export const markAsReadAdmin = async (notificationId: string) => {
  return await api.put(`/admin/notifications/read/${notificationId}`);
};

export const adminTutorView = async (tutorId: string) => {
  return await api.get<Tutor>(`/admin/tutor-view/${tutorId}`);
};

export const updateComplaint = async (
  selectedComplaint: string,
  status: string,
  response: string
) => {
  return await api.put(`/admin/complaints/${selectedComplaint}`, {
    status,
    response,
  });
};

export const refreshedComplaint=async()=>{
  return await api.get<{complaints:Complaint[],totalPages:number}>("/admin/complaints");
}