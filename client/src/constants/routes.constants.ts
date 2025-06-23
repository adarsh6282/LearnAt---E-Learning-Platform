export const USER_ROUTES = {
  ROOT: "/",
  REGISTER: "/users/register",
  LOGIN: "/users/login",
  VERIFY_OTP: "/users/verify-otp",
  FORGOT_PASSWORD: "/users/forgotpassword",
  RESET_PASSWORD: "/users/resetpassword",
  FORGOT_OTP: "/users/reset-verify-otp",
  GOOGLE_VERIFY: "/users/verifygoogle",
  PROFILE: "/users/profile",
  COURSES: "/users/courses",
  COURSE_DETAIL: (courseId: string = ".courseId") =>
    `/users/courses/${courseId}`,
} as const;

export const INSTRUCTOR_ROUTES = {
  REGISTER: "/instructors/register",
  LOGIN: "/instructors/login",
  VERIFY_OTP: "/instructors/verify-otp",
  FORGOT_OTP: "/instructors/reset-verify-otp",
  FORGOT_PASSWORD: "/instrcutors/forgotpassword",
  RESET_PASSWORD: "/instructors/resetpassword",
  BASE: "/instructors",
  DASHBOARD: "/instructors/dashboard",
  CREATE_COURSE: "/instructors/create-course",
  PROFILE: "/instructors/profile",
  COURSES: "/instructors/courses",
} as const;


export const ADMIN_ROUTES={
    LOGIN:"/admin/login",
    COURSES:"/admin/courses",
    DASHBOARD:"/admin/dashboard",
    BASE:"/admin",
    USERS:"/admin/users",
    TUTORS:"/admin/tutors",
    TUTOR_REQUESTS:"/admin/tutor-requests",
    CATEGORY:"/admin/category"
} as const