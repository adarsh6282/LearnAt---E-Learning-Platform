import { Authcontroller } from "../controllers/implementations/auth.controller";
import { AdminRepository } from "../repository/implementations/admin.repository";
import { AuthRepository } from "../repository/implementations/auth.repository";
import { CategoryRepository } from "../repository/implementations/category.repository";
import { CertificateRepository } from "../repository/implementations/certificate.repository";
import { ComplaintRepository } from "../repository/implementations/complaint.repository";
import { CourseRepository } from "../repository/implementations/course.repository";
import { InstructorAuth } from "../repository/implementations/instructorAuth.repository";
import { LiveSessionRepository } from "../repository/implementations/livesession.repository";
import { MessageRepository } from "../repository/implementations/message.repository";
import { NotificationRepository } from "../repository/implementations/notification.repository";
import { OrderRepository } from "../repository/implementations/order.repository";
import { OtpRepository } from "../repository/implementations/otp.repository";
import { ProgressRepository } from "../repository/implementations/progress.repository";
import { QuizRepository } from "../repository/implementations/quiz.repository";
import { QuizResultRepository } from "../repository/implementations/quizresult.repository";
import { WalletRepository } from "../repository/implementations/wallet.repository";
import { AuthService } from "../services/implementation/auth.services";
import { CertificateService } from "../services/implementation/certificate.service";
import { LiveSessionService } from "../services/implementation/livesession.services";
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
    const quizRepository= new QuizRepository()
    const quizResultRepository=new QuizResultRepository()
    const categoryRepository=new CategoryRepository()
    const messageRepository=new MessageRepository()
    const liveSessionRepository=new LiveSessionRepository()
    const livesessionService=new LiveSessionService(liveSessionRepository,courseRepository)
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
      categoryRepository,
      quizRepository,
      quizResultRepository,
      liveSessionRepository
    );

    export const authController=new Authcontroller(authService,messageService,certificateService,livesessionService)