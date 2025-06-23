import axiosInstance from "./apiService";
import type { User } from "../types/user.types";
import type { Tutor } from "../types/instructor.types";
import type { ICourse } from "../types/course.types";
import type { DashboardData } from "../types/admin.types";
import type { AdminLoginResponse } from "../types/admin.types";

interface Message{
  message:string
}

export const getTutorsS = async (): Promise<Tutor[]> => {
  const response = await axiosInstance.get<Tutor[]>("/admin/tutors", {
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });
  return response.data.filter((tutor) => tutor.isVerified === true);
};

export const toggleTutorBlockS = async (email: string, isBlocked: boolean) => {
  return await axiosInstance.put(
    `/admin/tutors/block/${email}`,
    { blocked: !isBlocked },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
};

export const getUsersS = async () => {
  return await axiosInstance.get<User[]>("/admin/users", {
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });
};

export const toggleUserBlockS = async (email: string, isBlocked: boolean) => {
  return await axiosInstance.put(
    `/admin/users/block/${email}`,
    { blocked: !isBlocked },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
};

export const getRequestsS = async () => {
  const res = await axiosInstance.get<Tutor[]>("/admin/tutors", {
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });
  return res.data.filter((tutor) => !tutor.isVerified);
};

export const handleAcceptS = async (email: string) => {
  return await axiosInstance.put(
    `/admin/tutors/verify`,
    { email },
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
};

export const handleRejectS = async (email: string, reason: string) => {
  return await axiosInstance.delete(`/admin/tutors/reject/${email}`, {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
    },
    data: { reason },
  } as any);
};

export const getCoursesS = async () => {
  return await axiosInstance.get<ICourse[]>("/admin/courses", {
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });
};

export const handleSoftDeleteS = async (id: string) => {
  return await axiosInstance.put<Message>(
    `/admin/courses/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
};

export const handleRestoreS = async (id: string) => {
  return await axiosInstance.put<Message>(
    `/admin/courses/recover/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    }
  );
};

export const getDashboardS = async () => {
  return await axiosInstance.get<DashboardData>("/admin/dashboard", {
    headers: { Authorization: `Bearer ${localStorage.getItem("adminToken")}` },
  });
};

export const adminLoginS = async (formData: {
  email: string;
  password: string;
}) => {
  return axiosInstance.post<AdminLoginResponse>("/admin/login", formData);
};
