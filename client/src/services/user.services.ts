import axiosInstance from "./apiService";
import type { IUserProfile } from "../types/user.types";
import type {
  Course,
  CourseViewType,
  VerifyOtpResponse,
} from "../types/user.types";
import type { IOrder, VerifyResponse } from "../types/order.types";
import type { Review } from "../types/review.types";

export const userRegisterS = async (formData: { email: string }) => {
  return await axiosInstance.post("/users/register", {
    email: formData.email,
  });
};

export const getUserProfileS = async () => {
  return await axiosInstance.get<IUserProfile>("/users/profile", {
    headers: { Authorization: `Bearer ${localStorage.getItem("usersToken")}` },
  });
};

export const getCoursesS = async () => {
  return await axiosInstance.get<Course[]>("/users/courses");
};

export const CreateOrderS = async (courseId: string, token: string) => {
  return await axiosInstance.post<IOrder>(
    "/users/orders",
    { courseId },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const verifyResS = async (
  data: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  },
  token: string
) => {
  return await axiosInstance.post<VerifyResponse>(
    "/users/orders/verify",
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const getReviewsS = async (courseId: string) => {
  console.log("reviews")
  return await axiosInstance.get<{ reviews: Review[] }>(
    `/users/reviews/courses/${courseId}`,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("usersToken")}`,
      },
    }
  );
};

export const postReviewS = async (
  courseId: string,
  userReview: { rating: number; text: string }
) => {
  return await axiosInstance.post(
    `/users/reviews/courses/${courseId}`,
    userReview,
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("usersToken")}`,
      },
    }
  );
};

export const getSpecificCourseS = async (courseId: string, token: string) => {
  return await axiosInstance.get<{
    course: CourseViewType;
    isEnrolled: boolean;
  }>(`/users/courses/${courseId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const verifyGoogleS = async (token: string) => {
  return await axiosInstance.post("/users/verifygoogle", { token });
};

export const userLoginS = async (email: string, password: string) => {
  return await axiosInstance.post<VerifyOtpResponse>("/users/login", {
    email,
    password,
  });
};

export const editProfileS = async (
  formPayload: FormData,
  token: string
) => {
  return await axiosInstance.put<IUserProfile>("/users/profile", formPayload, {
    headers: {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${token}`,
    },
  });
};
