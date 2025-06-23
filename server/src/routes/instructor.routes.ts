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

const instructorAuthRepository = new InstructorAuth();
const userRepository = new AuthRepository();
const adminRepository = new AdminRepository();
const otpRepository = new OtpRepository();
const courseRepository = new CourseRepository();
const reviewRepository = new ReviewRepository();
const orderRepository = new OrderRepository();
const walletRepository=new WalletRepository()
const instructorAuthService = new InstructorAuthSerivce(
  instructorAuthRepository,
  otpRepository,
  adminRepository,
  userRepository,
  courseRepository,
  reviewRepository,
  orderRepository,
  walletRepository
);
const instructorAuthController = new InstructorAuthController(
  instructorAuthService
);

const router = Router();

router.post(
  "/register",
  upload.single("resume"),
  instructorAuthController.signup.bind(instructorAuthController)
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

export default router;
