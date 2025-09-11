import axiosInstance from "./apiService";
import type { IUserProfile } from "../types/user.types";
import type {
  Course,
  CourseViewType,
  VerifyOtpResponse,
} from "../types/user.types";
import type { IOrder, VerifyResponse } from "../types/order.types";
import type { Review } from "../types/review.types";
import type { INotification } from "../context/NotificationContext";
import { createApi } from "./newApiService";

const api=createApi("user")

interface Certificate {
  _id: string;
  user: string;
  course: string;
  courseTitle: string;
  certificateUrl: string;
  issuedDate: string;
}

interface ChatResponse {
  _id: string;
}

interface Message {
  _id?: string;
  chatId: string;
  sender: string;
  content?: string;
  image?: string;
  createdAt: string;
}

interface Instructor {
  _id: string;
  name: string;
}

interface ChatPartner {
  chatId: string;
  partnerId: string;
  partnerName: string;
  lastMessage: string;
}

interface Orders {
  _id: string;
  course: Course;
  purchasedAt: string;
  amount: number;
  status: string;
}

interface PurchasedCourse {
  id: string;
  title: string;
  description: string;
  price: number;
  purchasedAt: string;
  thumbnail: string;
}

export const userRegisterS = async (formData: { email: string }) => {
  return await api.post("/users/register", {
    email: formData.email,
  });
};

export const getUserProfileS = async () => {
  return await api.get<IUserProfile>("/users/profile");
};

export const getCoursesS = async (
  page: number,
  limit: number,
  search: string,
  category: string,
  minPrice: number,
  maxPrice: number
) => {
  return await api.get<{
    courses: Course[];
    total: number;
    totalPages: number;
    categories: string[];
  }>(
    `/users/courses?page=${page}&limit=${limit}&search=${search}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`
  );
};

export const CreateOrderS = async (courseId: string) => {
  return await api.post<IOrder>("/users/orders", { courseId });
};

export const verifyResS = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  return await api.post<VerifyResponse>("/users/orders/verify", data);
};

// export const markOrderAsFailed=async(orderId:string)=>{
//   return await api.post("/users/fail-payment",{orderId})
// }

export const getReviewsS = async (courseId: string) => {
  return await api.get<{ reviews: Review[] }>(
    `/users/reviews/courses/${courseId}`
  );
};

export const postReviewS = async (
  courseId: string,
  userReview: { rating: number; text: string }
) => {
  return await api.post(`/users/reviews/courses/${courseId}`, userReview);
};

export const getSpecificCourseS = async (courseId: string) => {
  return await api.get<{
    course: CourseViewType;
    isEnrolled: boolean;
  }>(`/users/courses/${courseId}`);
};

export const verifyGoogleS = async (token: string) => {
  return await axiosInstance.post("/users/verifygoogle", { token });
};

export const userLoginS = async (email: string, password: string) => {
  return await api.post<VerifyOtpResponse>("/users/login", {
    email,
    password,
  });
};

export const editProfileS = async (formPayload: FormData) => {
  return await api.patch<IUserProfile>("/users/profile", formPayload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const giveComplaintS = async (
  type: string,
  subject: string,
  message: string,
  targetId?: string
) => {
  return await api.post("/users/complaints", {
    type,
    subject,
    message,
    targetId,
  });
};

export const getCertificatesS = async (userId: string) => {
  return await api.get<Certificate[]>(`/users/certificates/${userId}`);
};

export const changePasswordS = async (formData: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  return await api.post("/users/change-password", formData);
};

export const purchaseHistoryS = async (page: number, limit: number) => {
  return await api.get<{
    purchases: Orders[];
    total: number;
    totalPages: number;
  }>(`/users/purchase-history?page=${page}&limit=${limit}`);
};

export const getProgressS = async (courseId: string) => {
  return await api.get<{ watchedLectures: string[] }>(
    `/users/course-view/progress/${courseId}`
  );
};

export const markLectureWatchedS = async (
  courseId: string,
  lectureId: string
) => {
  const lecture = await api.post(`/users/course-view/progress/${courseId}`, {
    lectureId,
  });
  console.log(lectureId)
  return lecture
};

export const getPurchasedCoursesS = async (page: number, limit: number) => {
  return await api.get<{
    purchasedCourses: PurchasedCourse[];
    total: number;
    totalPages: number;
  }>(`/users/purchased-courses?page=${page}&limit=${limit}`);
};

export const getChatList = async (userId: string) => {
  const res = await api.get<any[]>(`/chats/list/${userId}?role=user`);

  const formattedChats: ChatPartner[] = res.data
    .filter((chat: any) => chat.instructor)
    .map((chat: any) => ({
      chatId: chat._id,
      partnerId: chat.instructor._id,
      partnerName: chat.instructor.name,
      lastMessage: chat.lastMessage,
    }));

  return formattedChats;
};

export const filteredInstructor = async (chats: ChatPartner[]) => {
  const res = await api.get<Instructor[]>("/users/instructors/purchased");
  const filtered = res.data.filter(
    (inst: any) => !chats.some((chat) => chat.partnerId === inst._id)
  );

  return filtered;
};

export const initiateChat = async (
  userId: string,
  instructorId: string
): Promise<ChatResponse> => {
  const res = await api.post<ChatResponse>("/chats/initiate", {
    userId,
    instructorId,
  });
  return res.data;
};

export const markMessagesReadS = async (
  chatId: string,
  userId: string,
  userModel: "User" | "Instructor"
) => {
  return await api.post(`/users/messages/mark-as-read/${chatId}`, {
    userId: userId,
    userModel: userModel,
  });
};

export const getMessageS = async (
  chatId: string,
  userId: string,
  userRole: string
) => {
  const res = await api.get<Message[]>(
    `/messages/${chatId}?userId=${userId}&role=${userRole}`
  );
  const normalized = res.data.map((msg: any) => ({
    ...msg,
    sender: msg.senderId,
  }));
  return normalized;
};

export const userLogout = async () => {
  return await api.post("/users/logout", {}, { withCredentials: true });
};

export const unreadCountS = async (
  userId: string,
  userModel: "User" | "Instructor"
) => {
  const res = await api.get<{ count: number; chat: string }[]>(
    `/users/chats/unread-counts?userId=${userId}&userModel=${userModel}`
  );
  const totalCount = res.data.reduce((acc, curr) => acc + curr.count, 0);
  return totalCount;
};

export const userNotification = async (userId: string) => {
  return await api.get<INotification[]>(`/users/notifications/${userId}`);
};

export const markAsReadS = async (notificationId: string) => {
  return await api.put(`/users/notifications/read/${notificationId}`);
};

export const sentImageinMessage = async (formData: FormData) => {
  return await api.post<{ message: string; url: string }>(
    "/messages/upload-image",
    formData,
    { headers: { "Content-Type": "multipart/form-data" } }
  );
};

export const userResetPassword = async (
  email: string,
  newPassword: string,
  confirmPassword: string
) => {
  return await api.put(`/users/resetpassword`, {
    email,
    newPassword,
    confirmPassword,
  });
};
