export const ADMIN_ROUTES = {
  LOGIN: "/login",
  REFRESH_TOKEN: "/refresh-token",

  USERS: "/users",
  BLOCK_UNBLOCK_USER: "/users/block/:email",

  TUTORS: "/tutors",
  BLOCK_UNBLOCK_TUTOR: "/tutors/block/:email",
  VERIFY_TUTOR: "/tutors/verify",
  REJECT_TUTOR: "/tutors/reject/:email",
  SPECIFIC_TUTOR: "/tutor-view/:id",

  DASHBOARD: "/dashboard",

  CATEGORY: "/category",
  DELETE_CATEGORY: "/category/delete/:id",
  RESTORE_CATEGORY: "/category/restore/:id",

  COURSES: "/courses",
  COURSE_ACTION: "/courses/:id",
  RECOVER_COURSE: "/courses/recover/:id",
  SPECIFIC_COURSE: "/courses/:courseId",

  REVIEWS: "/reviews",
  HIDE_REVIEW: "/reviews/:id/hide",
  UNHIDE_REVIEW: "/reviews/:id/unhide",
  DELETE_REVIEW: "/reviews/:id",

  WALLET: "/wallet",

  COMPLAINTS: "/complaints",
  RESPONSE_COMPLAINT: "/complaints/:id",

  COURSE_STATUS: "/course-status",
  INCOME_STATUS: "/income-status",

  NOTIFICATIONS: "/notifications/:userId",
  MARK_NOTIFICATION_READ: "/notifications/read/:notificationId",

  LOGOUT: "/logout",
} as const;

export const CHAT_ROUTES = {
  INITIATE: "/initiate",
  CHAT_LIST: "/list/:id",
} as const;

export const COURSE_ROUTES = {
  CREATE: "/",
  UPDATE: "/editcourse/:courseId",
} as const;

export const INSTRUCTOR_ROUTES = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",

  REFRESH_TOKEN: "/refresh-token",

  VERIFY_OTP: "/verify-otp",
  RESEND_OTP: "/resend-otp",

  FORGOT_PASSWORD: "/forgotpassword",
  RESET_VERIFY_OTP: "/reset-verify-otp",
  RESET_PASSWORD: "/resetpassword",

  PROFILE: "/profile",
  REAPPLY: "/reapply",

  COURSES: "/courses",
  COURSE_BY_ID: "/courses/:courseId",

  CATEGORY: "/category",

  REVIEWS: "/reviews",

  ENROLLMENTS: "/enrollments",

  WALLET: "/wallet",

  DASHBOARD: "/dashboard",
  COURSE_STATS: "/course-stats",
  INCOME_STATS: "/income-stats",

  PURCHASED_USERS: "/users/purchased",

  NOTIFICATIONS: "/notifications/:userId",
  MARK_NOTIFICATION_READ: "/notifications/read/:notificationId",

  UNREAD_CHAT_COUNTS: "/chats/unread-counts",
  MARK_MESSAGES_READ: "/messages/mark-as-read/:chatId",

  CREATE_QUIZ: "/quiz/create-quiz/:courseId",
  QUIZZES: "/quiz",
  QUIZ_BY_ID: "/quiz/:quizId",
  DELETE_QUIZ: "/delete/quiz/:quizId",
  RESTORE_QUIZ: "/restore/quiz/:quizId",

  CREATE_LIVE_SESSION: "/live/create-session",
  LIVE_TOKEN: "/live/token",
  END_LIVE_SESSION: "/live/end-live",

  ADD_COURSE_COUPON: "/courses/coupons/:courseId",
  COUPONS: "/coupons",
  UPDATE_COUPON: "/coupons/:id",
} as const;

export const MESSAGE_ROUTES = {
  GET_MESSAGES: "/:chatId",
  UPLOAD_IMAGE: "/upload-image",
} as const;

export const REVIEW_ROUTES = {
  COURSE_REVIEWS: "/courses/:courseId",
} as const;

export const USER_ROUTES = {
  REGISTER: "/register",
  LOGIN: "/login",
  LOGOUT: "/logout",

  REFRESH_TOKEN: "/refresh-token",

  VERIFY_OTP: "/verify-otp",
  RESEND_OTP: "/resend-otp",

  FORGOT_PASSWORD: "/forgotpassword",
  RESET_VERIFY_OTP: "/reset-verify-otp",
  RESET_PASSWORD: "/resetpassword",

  VERIFY_GOOGLE: "/verifygoogle",

  PROFILE: "/profile",

  COURSES: "/courses",
  COURSE_BY_ID: "/courses/:courseId",

  CATEGORY: "/category",

  ORDERS: "/orders",
  VERIFY_ORDER: "/orders/verify",
  CANCEL_ORDER: "/cancel-order/:orderId",
  RETRY_PAYMENT: "/retrypayment/:orderId",
  COURSE_ORDER: "/course-order/:courseId",

  COURSE_PROGRESS: "/course-view/progress/:courseId",
  COURSE_STATUS: "/courses/progress/:courseId",

  GOOGLE_AUTH: "/auth/google",
  GOOGLE_CALLBACK: "/auth/google/callback",

  PURCHASED_INSTRUCTORS: "/instructors/purchased",

  COMPLAINTS: "/complaints",

  NOTIFICATIONS: "/notifications/:userId",
  MARK_NOTIFICATION_READ: "/notifications/read/:notificationId",

  PURCHASE_HISTORY: "/purchase-history",
  PURCHASED_COURSES: "/purchased-courses",

  CHANGE_PASSWORD: "/change-password",

  COURSE_INSTRUCTOR: "/courseinstructor/:instructorId",

  CERTIFICATES: "/certificates/:id",
  CREATE_CERTIFICATE: "/create-certificate",

  UNREAD_CHAT_COUNTS: "/chats/unread-counts",
  MARK_MESSAGES_READ: "/messages/mark-as-read/:chatId",

  QUIZ: "/quiz/:courseId",
  SUBMIT_QUIZ: "/submitquiz/:quizId",

  LIVE_TOKEN: "/live/token",
  COURSE_LIVE: "/course/live/:courseId",

  COURSE_COUPONS: "/course/coupons/:courseId",
} as const;