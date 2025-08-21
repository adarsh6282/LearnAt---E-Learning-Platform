import { Router } from "express";
import { Authcontroller } from "../controllers/implementations/auth.controller";
import { AuthRepository } from "../repository/implementations/auth.repository";
import { OtpRepository } from "../repository/implementations/otp.repository";
import { AuthService } from "../services/implementation/auth.services";
import passport from "../config/passport.config";
import { AdminRepository } from "../repository/implementations/admin.repository";
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository";
import { CourseRepository } from "../repository/implementations/course.repository";
import upload from "../utils/multer";
import { OrderRepository } from "../repository/implementations/order.repository";
import authRole from "../middlewares/authRole";
import { ProgressRepository } from "../repository/implementations/progress.repository";
import { WalletRepository } from "../repository/implementations/wallet.repository";
import { ComplaintRepository } from "../repository/implementations/complaint.repository";
import { NotificationRepository } from "../repository/implementations/notification.repository";
import { CertificateRepository } from "../repository/implementations/certificate.repository";
import { CertificateService } from "../services/implementation/certificate.service";
import { CategoryRepository } from "../repository/implementations/category.repository";
import { MessageService } from "../services/implementation/message.service";
import { MessageRepository } from "../repository/implementations/message.repository";

const authRepository = new AuthRepository();
const instructorRepository = new InstructorAuth();
const otpRepository = new OtpRepository();
const adminRepository = new AdminRepository();
const courseRepository = new CourseRepository();
const orderRepository = new OrderRepository();
const progressRepository = new ProgressRepository();
const walletRepository = new WalletRepository();
const complaintRepository = new ComplaintRepository();
const notificationRepository = new NotificationRepository();
const certificateRepository=new CertificateRepository()
const categoryRepository=new CategoryRepository()
const messageRepository=new MessageRepository()
const messageService=new MessageService(messageRepository)
const certificateService=new CertificateService(certificateRepository)
const authService = new AuthService(
  authRepository,
  otpRepository,
  adminRepository,
  instructorRepository,
  courseRepository,
  orderRepository,
  progressRepository,
  walletRepository,
  complaintRepository,
  notificationRepository,
  certificateRepository,
  certificateService,
  categoryRepository
);
const authController = new Authcontroller(authService,messageService);

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
router.post("/logout", authController.logOut.bind(authController));

export default router;
