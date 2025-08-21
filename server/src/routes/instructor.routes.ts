import { Router } from "express";
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository";
import { InstructorAuthController } from "../controllers/implementations/instructorAuth.controller";
import { InstructorAuthSerivce } from "../services/implementation/instructorAuth.services";
import { OtpRepository } from "../repository/implementations/otp.repository";
import { AuthRepository } from "../repository/implementations/auth.repository";
import { AdminRepository } from "../repository/implementations/admin.repository";
import upload from "../utils/multer";
import authRole from "../middlewares/authRole";
import { CourseRepository } from "../repository/implementations/course.repository";
import { ReviewRepository } from "../repository/implementations/review.repository";
import { OrderRepository } from "../repository/implementations/order.repository";
import { WalletRepository } from "../repository/implementations/wallet.repository";
import { CategoryRepository } from "../repository/implementations/category.repository";
import { NotificationRepository } from "../repository/implementations/notification.repository";
import { MessageRepository } from "../repository/implementations/message.repository";
import { MessageService } from "../services/implementation/message.service";

const instructorAuthRepository = new InstructorAuth();
const userRepository = new AuthRepository();
const adminRepository = new AdminRepository();
const otpRepository = new OtpRepository();
const courseRepository = new CourseRepository();
const reviewRepository = new ReviewRepository();
const orderRepository = new OrderRepository();
const walletRepository = new WalletRepository();
const categoryRepository = new CategoryRepository();
const messageRepository=new MessageRepository()
const notificationRepository = new NotificationRepository();
const messageService=new MessageService(messageRepository)
const instructorAuthService = new InstructorAuthSerivce(
  instructorAuthRepository,
  otpRepository,
  adminRepository,
  userRepository,
  courseRepository,
  reviewRepository,
  orderRepository,
  walletRepository,
  categoryRepository,
  notificationRepository
);
const instructorAuthController = new InstructorAuthController(
  instructorAuthService,
  messageService
);

const router = Router();

router.post(
  "/register",
  upload.single("resume"),
  instructorAuthController.signup.bind(instructorAuthController)
);
router.post(
  "/refresh-token",
  instructorAuthController.refreshToken.bind(instructorAuthController)
);
router.post(
  "/login",
  instructorAuthController.signin.bind(instructorAuthController)
);
router.post(
  "/verify-otp",
  instructorAuthController.verifyOtp.bind(instructorAuthController)
);
router.post(
  "/forgotpassword",
  instructorAuthController.forgotPassword.bind(instructorAuthController)
);
router.post(
  "/reset-verify-otp",
  instructorAuthController.verifyForgotOtp.bind(instructorAuthController)
);
router.put(
  "/resetpassword",
  instructorAuthController.resetPassword.bind(instructorAuthController)
);
router.post(
  "/resend-otp",
  instructorAuthController.resentOtp.bind(instructorAuthController)
);
router.get(
  "/profile",
  authRole(["instructor"]),
  instructorAuthController.getProfile.bind(instructorAuthController)
);
router.get(
  "/courses",
  authRole(["instructor"]),
  instructorAuthController.getCourses.bind(instructorAuthController)
);
router.put(
  "/reapply",
  authRole(["instructor"]),
  upload.single("resume"),
  instructorAuthController.reApply.bind(instructorAuthController)
);
router.get(
  "/courses/:courseId",
  authRole(["instructor"]),
  instructorAuthController.getCoursesById.bind(instructorAuthController)
);
router.get(
  "/category",
  authRole(["instructor"]),
  instructorAuthController.getCategory.bind(instructorAuthController)
);
router.get(
  "/reviews",
  authRole(["instructor"]),
  instructorAuthController.getInstructorReviews.bind(instructorAuthController)
);
router.get(
  "/enrollments",
  authRole(["instructor"]),
  instructorAuthController.getEnrollments.bind(instructorAuthController)
);
router.put(
  "/profile",
  authRole(["instructor"]),
  upload.single("profilePicture"),
  instructorAuthController.updateProfile.bind(instructorAuthController)
);
router.get(
  "/wallet",
  authRole(["instructor"]),
  instructorAuthController.getWallet.bind(instructorAuthController)
);
router.get(
  "/dashboard",
  authRole(["instructor"]),
  instructorAuthController.getDashboard.bind(instructorAuthController)
);
router.get(
  "/course-stats",
  authRole(["instructor"]),
  instructorAuthController.getCourseStats.bind(instructorAuthController)
);
router.get(
  "/income-stats",
  authRole(["instructor"]),
  instructorAuthController.getIncomeStats.bind(instructorAuthController)
);
router.get(
  "/users/purchased",
  authRole(["instructor"]),
  instructorAuthController.getPurchasedStudents.bind(instructorAuthController)
);
router.get(
  "/notifications/:userId",
  instructorAuthController.getNotifications.bind(instructorAuthController)
);
router.put(
  "/notifications/read/:notificationId",
  instructorAuthController.markAsRead.bind(instructorAuthController)
);
router.get("/chats/unread-counts",authRole(["instructor"]),instructorAuthController.getUnreadCounts.bind(instructorAuthController))
router.post("/messages/mark-as-read/:chatId",authRole(["instructor"]),instructorAuthController.markRead.bind(instructorAuthController))
router.post(
  "/logout",
  instructorAuthController.logOut.bind(instructorAuthController)
);

export default router;
