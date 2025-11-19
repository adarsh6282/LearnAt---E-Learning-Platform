import { Router } from "express";
import passport from "../config/passport.config";
import upload from "../utils/multer";
import authRole from "../middlewares/authRole";
import { authController } from "../dependencyHandlers/user.dependencyhandler";
import multer from "multer";

const storage = multer.memoryStorage();
const uploadCertificate = multer({ storage });

const router = Router();

router.post("/register", authController.signup.bind(authController));
router.post("/refresh-token", authController.refreshToken.bind(authController));
router.post("/login", authController.signin.bind(authController));
router.post("/verify-otp", authController.verifyOtp.bind(authController));
router.post(
  "/forgotpassword",
  authController.forgotPassword.bind(authController)
);
router.post(
  "/reset-verify-otp",
  authController.verifyForgotOtp.bind(authController)
);
router.put("/resetpassword", authController.resetPassword.bind(authController));
router.post("/verifygoogle", authController.verifyGoogle.bind(authController));
router.post("/resend-otp", authController.resentOtp.bind(authController));
router.get(
  "/profile",
  authRole(["user"]),
  authController.getProfile.bind(authController)
);
router.patch(
  "/profile",
  authRole(["user"]),
  upload.single("profilePicture"),
  authController.updateProfile.bind(authController)
);
router.get("/courses", authController.getCourses.bind(authController));
router.get("/category",authController.getCategory.bind(authController))
router.post(
  "/orders",
  authRole(["user"]),
  authController.buyCourse.bind(authController)
);
router.put("/cancel-order/:orderId",authRole(["user"]),authController.cancelOrder.bind(authController))
router.get("/course-order/:courseId",authRole(["user"]),authController.getPreviousOrder.bind(authController))
router.put("/retrypayment/:orderId",authRole(["user"]),authController.retryPayment.bind(authController))
router.post(
  "/orders/verify",
  authRole(["user"]),
  authController.verifyOrder.bind(authController)
);
router.get(
  "/courses/:courseId",
  authRole(["user"]),
  authController.findCourseById.bind(authController)
);
router.post(
  "/course-view/progress/:courseId",
  authRole(["user"]),
  authController.markLectureWatched.bind(authController)
);
router.get(
  "/course-view/progress/:courseId",
  authRole(["user"]),
  authController.getCourseProgress.bind(authController)
);
router.get(
  "/courses/progress/:courseId",
  authRole(["user"]),
  authController.checkStatus.bind(authController)
);
router.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/register",
    session: false,
  }),
  authController.googleAuth.bind(authController)
);

router.get(
  "/instructors/purchased",
  authRole(["user"]),
  authController.getPurchasedInstructors.bind(authController)
);
router.post(
  "/complaints",
  authRole(["user"]),
  authController.submitComplaint.bind(authController)
);
router.get(
  "/notifications/:userId",
  authController.getNotifications.bind(authController)
);
router.put(
  "/notifications/read/:notificationId",
  authController.markAsRead.bind(authController)
);
router.get(
  "/purchase-history",
  authRole(["user"]),
  authController.getPurchases.bind(authController)
);
router.get("/purchased-courses",authRole(["user"]),authController.purchasedCourses.bind(authController))
router.post("/change-password",authRole(["user"]),authController.changePassword.bind(authController))
router.get("/courseinstructor/:instructorId",authRole(["user"]),authController.courseInstructorView.bind(authController))
router.get("/certificates/:id",authRole(["user"]),authController.getCertificates.bind(authController))
router.get("/chats/unread-counts",authRole(["user"]),authController.getUnreadCounts.bind(authController))
router.post("/messages/mark-as-read/:chatId",authRole(["user"]),authController.markRead.bind(authController))
router.get("/quiz/:courseId",authRole(["user"]),authController.getQuiz.bind(authController))
router.post("/submitquiz/:quizId",authRole(["user"]),authController.submitQuiz.bind(authController))
router.post("/create-certificate",uploadCertificate.single("certificate"),authController.createCertificate.bind(authController))
router.get("/live/token",authRole(["user"]),authController.getSessionToken.bind(authController))
router.get("/course/live/:courseId",authRole(["user"]),authController.getLiveSessionByCourseId.bind(authController))
router.get(`/course/coupons/:courseId`,authRole(["user"]),authController.getCouponsForCourse.bind(authController))
router.post("/logout", authController.logOut.bind(authController));

export default router;
