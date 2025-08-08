import { Router } from "express";
import { AdminController } from "../controllers/implementations/admin.controller";
import { AdminService } from "../services/implementation/admin.sevices";
import { AdminRepository } from "../repository/implementations/admin.repository";
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository";
import { AuthRepository } from "../repository/implementations/auth.repository";
import { CategoryRepository } from "../repository/implementations/category.repository";
import { CourseRepository } from "../repository/implementations/course.repository";
import authRole from "../middlewares/authRole";
import { ReviewRepository } from "../repository/implementations/review.repository";
import { WalletRepository } from "../repository/implementations/wallet.repository";
import { ComplaintRepository } from "../repository/implementations/complaint.repository";
import { NotificationRepository } from "../repository/implementations/notification.repository";

const adminRepository = new AdminRepository();
const instructorRepository = new InstructorAuth();
const categoryRepository = new CategoryRepository();
const userRepository = new AuthRepository();
const courseRepository = new CourseRepository();
const reviewRepository = new ReviewRepository();
const walletRepository = new WalletRepository();
const complaintRepository = new ComplaintRepository();
const notificationRepository = new NotificationRepository();
const adminService = new AdminService(
  adminRepository,
  instructorRepository,
  userRepository,
  categoryRepository,
  courseRepository,
  reviewRepository,
  walletRepository,
  complaintRepository,
  notificationRepository
);
const adminController = new AdminController(adminService);

const router = Router();

router.post("/login", adminController.login.bind(adminController));
router.post(
  "/refresh-token",
  adminController.refreshToken.bind(adminController)
);
router.get(
  "/users",
  authRole(["admin"]),
  adminController.getAllUsers.bind(adminController)
);
router.get(
  "/tutors",
  authRole(["admin"]),
  adminController.getAllTutors.bind(adminController)
);
router.put(
  "/users/block/:email",
  authRole(["admin"]),
  adminController.blockUnblockUser.bind(adminController)
);
router.put(
  "/tutors/block/:email",
  authRole(["admin"]),
  adminController.blockUnblockTutor.bind(adminController)
);
router.get(
  "/dashboard",
  authRole(["admin"]),
  adminController.getDashboard.bind(adminController)
);
router.put(
  "/tutors/verify",
  authRole(["admin"]),
  adminController.approveTutor.bind(adminController)
);
router.get(
  "/category",
  authRole(["admin", "instructor"]),
  adminController.getCatgeories.bind(adminController)
);
router.post(
  "/category",
  authRole(["admin"]),
  adminController.addCategory.bind(adminController)
);
router.patch(
  `/category/delete/:id`,
  authRole(["admin"]),
  adminController.deleteCategory.bind(adminController)
);
router.patch(
  `/category/restore/:id`,
  authRole(["admin"]),
  adminController.restoreCategory.bind(adminController)
);
router.get(
  "/courses",
  authRole(["admin"]),
  adminController.getCourses.bind(adminController)
);
router.put(
  "/courses/:id",
  authRole(["admin"]),
  adminController.softDeleteCourse.bind(adminController)
);
router.put(
  "/courses/recover/:id",
  authRole(["admin"]),
  adminController.recoverCourse.bind(adminController)
);
router.get(
  "/reviews",
  authRole(["admin"]),
  adminController.getAllReviews.bind(adminController)
);
router.put(
  "/reviews/:id/hide",
  authRole(["admin"]),
  adminController.hideReview.bind(adminController)
);
router.put(
  "/reviews/:id/unhide",
  authRole(["admin"]),
  adminController.unhideReview.bind(adminController)
);
router.delete(
  "/reviews/:id/",
  authRole(["admin"]),
  adminController.deleteReview.bind(adminController)
);
router.delete(
  "/tutors/reject/:email",
  authRole(["admin"]),
  adminController.rejectTutor.bind(adminController)
);
router.get(
  "/wallet",
  authRole(["admin"]),
  adminController.getWallet.bind(adminController)
);
router.get(
  "/complaints",
  authRole(["admin"]),
  adminController.getComplaints.bind(adminController)
);
router.put(
  "/complaints/:id",
  authRole(["admin"]),
  adminController.responseComplaint.bind(adminController)
);
router.get(
  "/course-status",
  adminController.getCourseStats.bind(adminController)
);
router.get(
  "/income-status",
  adminController.getIncomeStats.bind(adminController)
);
router.get(
  "/courses/:courseId",
  adminController.getSpecificCourseforAdmin.bind(adminController)
);
router.get(
  "/tutor-view/:id",authRole(["admin"]),
  adminController.getSpecificTutor.bind(adminController)
);
router.get(
  "/notifications/:userId",
  adminController.getNotifications.bind(adminController)
);
router.put(
  "/notifications/read/:notificationId",
  adminController.markAsRead.bind(adminController)
);
router.post("/logout", adminController.logOut.bind(adminController));

export default router;
