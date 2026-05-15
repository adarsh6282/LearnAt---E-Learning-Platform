import { Router } from "express";
import passport from "../config/passport.config";
import upload from "../utils/multer";
import authRole from "../middlewares/authRole";
import { authController } from "../dependencyHandlers/user.dependencyhandler";
import multer from "multer";
import { USER_ROUTES } from "../constants/routes";

const storage = multer.memoryStorage();
const uploadCertificate = multer({ storage });

const router = Router();

router.post(USER_ROUTES.REGISTER, authController.signup.bind(authController));
router.post(USER_ROUTES.REFRESH_TOKEN, authController.refreshToken.bind(authController));
router.post(USER_ROUTES.LOGIN, authController.signin.bind(authController));
router.post(USER_ROUTES.VERIFY_OTP, authController.verifyOtp.bind(authController));
router.post(
  USER_ROUTES.FORGOT_PASSWORD,
  authController.forgotPassword.bind(authController)
);
router.post(
  USER_ROUTES.RESET_VERIFY_OTP,
  authController.verifyForgotOtp.bind(authController)
);
router.put(USER_ROUTES.RESET_PASSWORD, authController.resetPassword.bind(authController));
router.post(USER_ROUTES.VERIFY_GOOGLE, authController.verifyGoogle.bind(authController));
router.post(USER_ROUTES.RESEND_OTP, authController.resentOtp.bind(authController));
router.get(
  USER_ROUTES.PROFILE,
  authRole(["user"]),
  authController.getProfile.bind(authController)
);
router.patch(
  USER_ROUTES.PROFILE,
  authRole(["user"]),
  upload.single("profilePicture"),
  authController.updateProfile.bind(authController)
);
router.get(USER_ROUTES.COURSES, authController.getCourses.bind(authController));
router.get(USER_ROUTES.CATEGORY,authController.getCategory.bind(authController))
router.post(
  USER_ROUTES.ORDERS,
  authRole(["user"]),
  authController.buyCourse.bind(authController)
);
router.put(USER_ROUTES.CANCEL_ORDER,authRole(["user"]),authController.cancelOrder.bind(authController))
router.get(USER_ROUTES.COURSE_ORDER,authRole(["user"]),authController.getPreviousOrder.bind(authController))
router.put(USER_ROUTES.RETRY_PAYMENT,authRole(["user"]),authController.retryPayment.bind(authController))
router.post(
  USER_ROUTES.VERIFY_ORDER,
  authRole(["user"]),
  authController.verifyOrder.bind(authController)
);
router.get(
  USER_ROUTES.COURSE_BY_ID,
  authRole(["user"]),
  authController.findCourseById.bind(authController)
);
router.post(
  USER_ROUTES.COURSE_PROGRESS,
  authRole(["user"]),
  authController.markLectureWatched.bind(authController)
);
router.get(
  USER_ROUTES.COURSE_PROGRESS,
  authRole(["user"]),
  authController.getCourseProgress.bind(authController)
);
router.get(
  USER_ROUTES.COURSE_STATUS,
  authRole(["user"]),
  authController.checkStatus.bind(authController)
);
router.get(
  USER_ROUTES.GOOGLE_AUTH,
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  USER_ROUTES.GOOGLE_CALLBACK,
  passport.authenticate("google", {
    failureRedirect: "/register",
    session: false,
  }),
  authController.googleAuth.bind(authController)
);

router.get(
  USER_ROUTES.PURCHASED_INSTRUCTORS,
  authRole(["user"]),
  authController.getPurchasedInstructors.bind(authController)
);
router.post(
  USER_ROUTES.COMPLAINTS,
  authRole(["user"]),
  authController.submitComplaint.bind(authController)
);
router.get(
  USER_ROUTES.NOTIFICATIONS,
  authController.getNotifications.bind(authController)
);
router.put(
  USER_ROUTES.MARK_NOTIFICATION_READ,
  authController.markAsRead.bind(authController)
);
router.get(
  USER_ROUTES.PURCHASE_HISTORY,
  authRole(["user"]),
  authController.getPurchases.bind(authController)
);
router.get(USER_ROUTES.PURCHASED_COURSES,authRole(["user"]),authController.purchasedCourses.bind(authController))
router.post(USER_ROUTES.CHANGE_PASSWORD,authRole(["user"]),authController.changePassword.bind(authController))
router.get(USER_ROUTES.COURSE_INSTRUCTOR,authRole(["user"]),authController.courseInstructorView.bind(authController))
router.get(USER_ROUTES.CERTIFICATES,authRole(["user"]),authController.getCertificates.bind(authController))
router.get(USER_ROUTES.UNREAD_CHAT_COUNTS,authRole(["user"]),authController.getUnreadCounts.bind(authController))
router.post(USER_ROUTES.MARK_MESSAGES_READ,authRole(["user"]),authController.markRead.bind(authController))
router.get(USER_ROUTES.QUIZ,authRole(["user"]),authController.getQuiz.bind(authController))
router.post(USER_ROUTES.SUBMIT_QUIZ,authRole(["user"]),authController.submitQuiz.bind(authController))
router.post(USER_ROUTES.CREATE_CERTIFICATE,uploadCertificate.single("certificate"),authController.createCertificate.bind(authController))
router.get(USER_ROUTES.LIVE_TOKEN,authRole(["user"]),authController.getSessionToken.bind(authController))
router.get(USER_ROUTES.COURSE_LIVE,authRole(["user"]),authController.getLiveSessionByCourseId.bind(authController))
router.get(USER_ROUTES.COURSE_COUPONS,authRole(["user"]),authController.getCouponsForCourse.bind(authController))
router.post(USER_ROUTES.LOGOUT, authController.logOut.bind(authController));

export default router;
