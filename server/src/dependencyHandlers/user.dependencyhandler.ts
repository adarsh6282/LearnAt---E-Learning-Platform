import { Authcontroller } from "../controllers/implementations/auth.controller";
import { AdminRepository } from "../repository/implementations/admin.repository";
import { AuthRepository } from "../repository/implementations/auth.repository";
import { CategoryRepository } from "../repository/implementations/category.repository";
import { CertificateRepository } from "../repository/implementations/certificate.repository";
import { ComplaintRepository } from "../repository/implementations/complaint.repository";
import { CourseRepository } from "../repository/implementations/course.repository";
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository";
import { MessageRepository } from "../repository/implementations/message.repository";
import { NotificationRepository } from "../repository/implementations/notification.repository";
import { OrderRepository } from "../repository/implementations/order.repository";
import { OtpRepository } from "../repository/implementations/otp.repository";
import { ProgressRepository } from "../repository/implementations/progress.repository";
import { WalletRepository } from "../repository/implementations/wallet.repository";
import { AuthService } from "../services/implementation/auth.services";
import { CertificateService } from "../services/implementation/certificate.service";
import { MessageService } from "../services/implementation/message.service";

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

    export const authController=new Authcontroller(authService,messageService)