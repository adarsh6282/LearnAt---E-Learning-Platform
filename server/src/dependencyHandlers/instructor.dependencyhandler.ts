import { InstructorAuthController } from "../controllers/implementations/instructorAuth.controller";
import { AdminRepository } from "../repository/implementations/admin.repository";
import { AuthRepository } from "../repository/implementations/auth.repository";
import { CategoryRepository } from "../repository/implementations/category.repository";
import { CourseRepository } from "../repository/implementations/course.repository";
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository";
import { MessageRepository } from "../repository/implementations/message.repository";
import { NotificationRepository } from "../repository/implementations/notification.repository";
import { OrderRepository } from "../repository/implementations/order.repository";
import { OtpRepository } from "../repository/implementations/otp.repository";
import { ReviewRepository } from "../repository/implementations/review.repository";
import { WalletRepository } from "../repository/implementations/wallet.repository";
import { InstructorAuthSerivce } from "../services/implementation/instructorAuth.services";
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
export const instructorAuthController = new InstructorAuthController(
  instructorAuthService,
  messageService
);