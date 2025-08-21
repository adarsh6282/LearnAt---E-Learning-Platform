import axiosInstance from "./apiService";
import type { IUserProfile } from "../types/user.types";
import type {
  Course,
  CourseViewType,
  VerifyOtpResponse,
} from "../types/user.types";
import type { IOrder, VerifyResponse } from "../types/order.types";
import type { Review } from "../types/review.types";
import userApi from "./userApiService";

export const userRegisterS = async (formData: { email: string }) => {
  return await userApi.post("/users/register", {
    email: formData.email,
  });
};

export const getUserProfileS = async () => {
  return await userApi.get<IUserProfile>("/users/profile");
};

export const getCoursesS = async (
  page: number,
  limit: number,
  search: string,
  category: string,
  minPrice: number,
  maxPrice: number
) => {
  return await userApi.get<{courses:Course[],total:number,totalPages:number,categories:string[]}>(
    `/users/courses?page=${page}&limit=${limit}&search=${search}&category=${category}&minPrice=${minPrice}&maxPrice=${maxPrice}`
  );
};

export const CreateOrderS = async (courseId: string) => {
  return await userApi.post<IOrder>("/users/orders", { courseId });
};

export const verifyResS = async (data: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}) => {
  return await userApi.post<VerifyResponse>("/users/orders/verify", data);
};

export const getReviewsS = async (courseId: string) => {
  return await userApi.get<{ reviews: Review[] }>(
    `/users/reviews/courses/${courseId}`
  );
};

export const postReviewS = async (
  courseId: string,
  userReview: { rating: number; text: string }
) => {
  return await userApi.post(`/users/reviews/courses/${courseId}`, userReview);
};

export const getSpecificCourseS = async (courseId: string) => {
  return await userApi.get<{
    course: CourseViewType;
    isEnrolled: boolean;
  }>(`/users/courses/${courseId}`);
};

export const verifyGoogleS = async (token: string) => {
  return await axiosInstance.post("/users/verifygoogle", { token });
};

export const userLoginS = async (email: string, password: string) => {
  return await userApi.post<VerifyOtpResponse>("/users/login", {
    email,
    password,
  });
};

export const editProfileS = async (formPayload: FormData) => {
  return await userApi.patch<IUserProfile>("/users/profile", formPayload, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
