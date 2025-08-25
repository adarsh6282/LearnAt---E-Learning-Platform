import { AdminController } from "../controllers/implementations/admin.controller";
import { AdminRepository } from "../repository/implementations/admin.repository";
import { AuthRepository } from "../repository/implementations/auth.repository";
import { CategoryRepository } from "../repository/implementations/category.repository";
import { ComplaintRepository } from "../repository/implementations/complaint.repository";
import { CourseRepository } from "../repository/implementations/course.repository";
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository";
import { NotificationRepository } from "../repository/implementations/notification.repository";
import { ReviewRepository } from "../repository/implementations/review.repository";
import { WalletRepository } from "../repository/implementations/wallet.repository";
import { AdminService } from "../services/implementation/admin.sevices";

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
export const adminController = new AdminController(adminService);