import { IAuthService } from "../interfaces/auth.services";
import { IAuthRepository } from "../../repository/interfaces/auth.interface";
import { IUser } from "../../models/interfaces/auth.interface";
import generateOtp, { otpExpiry } from "../../utils/otpGenerator";
import { sendMail } from "../../utils/sendMail";
import bcrypt from "bcrypt";
import { IOtpRepository } from "../../repository/interfaces/otp.interface";
import { IAdminRepository } from "../../repository/interfaces/admin.interface";
import { IInstructorAuthRepository } from "../../repository/interfaces/instructorAuth.interface";
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import cloudinary from "../../config/cloudinary.config";
import { ICourseRepository } from "../../repository/interfaces/course.interface";
import razorpay from "../../config/razorpay.config";
import { IOrderRepository } from "../../repository/interfaces/order.interace";
import crypto from "crypto";
import { Types } from "mongoose";
import { IProgressRepository } from "../../repository/interfaces/progress.interface";
import { IWalletRepository } from "../../repository/interfaces/wallet.interface";
import { IComplaintRepository } from "../../repository/interfaces/complaint.interface";
import { IComplaint } from "../../models/interfaces/complaint.interface";
import { INotificationRepository } from "../../repository/interfaces/notification.interface";
import {
  IPurchase,
  PurchasedCourse,
} from "../../repository/implementations/order.repository";
import { ICertificateReopsitory } from "../../repository/interfaces/certificate.interface";
import { IQuizResultRepository } from "../../repository/interfaces/quizresult.interface";
import { ICategoryRepository } from "../../repository/interfaces/category.interface";
import { sendNotificationToUser } from "../../socket/socket";
import { UserDTO } from "../../DTO/user.dto";
import { toUserDTO } from "../../Mappers/user.mapper";
import { InstructorDTO } from "../../DTO/instructor.dto";
import { toInstructorDTO } from "../../Mappers/instructor.mapper";
import { CourseDTO } from "../../DTO/course.dto";
import { toCourseDTO, toCourseDTOList } from "../../Mappers/course.mapper";
import { OrderDTO } from "../../DTO/order.dto";
import { toOrderDTO } from "../../Mappers/order.mapper";
import { ProgressDTO } from "../../DTO/progress.dto";
import { toProgressDTO } from "../../Mappers/progress.mapper";
import { NotificationDTO } from "../../DTO/notification.dto";
import {
  toNotificationDTO,
  toNotificationDTOList,
} from "../../Mappers/notification.mapper";
import { ComplaintDTO } from "../../DTO/complaint.dto";
import { toComplaintDTO } from "../../Mappers/complaint.mapper";
import {
  IQuiz,
  Option,
  Question,
} from "../../models/interfaces/quiz.interface";
import { IQuizRepository } from "../../repository/interfaces/quiz.interface";
import { ILiveSessionRepository } from "../../repository/interfaces/livesession.interface";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IAuthRepository,
    private _otpRepository: IOtpRepository,
    private _adminRepository: IAdminRepository,
    private _instructorRepository: IInstructorAuthRepository,
    private _courseRepository: ICourseRepository,
    private _orderRepsitory: IOrderRepository,
    private _progressRepository: IProgressRepository,
    private _walletRepository: IWalletRepository,
    private _complaintRepository: IComplaintRepository,
    private _notificationRepository: INotificationRepository,
    private _certificateRepository: ICertificateReopsitory,
    private _categoryRepository: ICategoryRepository,
    private _quizRepository: IQuizRepository,
    private _quizResultRepository: IQuizResultRepository,
    private _livesessionRepository: ILiveSessionRepository
  ) {}

  async registerUser(email: string): Promise<void> {
    const existingAdmin = await this._adminRepository.findAdminByEmail(email);
    if (existingAdmin) {
      throw new Error(
        "This email is used by admin. Please register with new one"
      );
    }
    const existingInstructor =
      await this._instructorRepository.findByEmail(email);
    if (existingInstructor) {
      throw new Error(
        "This email is used by instrcutor. Please register with new one"
      );
    }
    const existingUser = await this._userRepository.findByEmail(email);

    if (existingUser) throw new Error("User already exists");

    const otp = generateOtp();

    await this._otpRepository.saveOTP({
      email: email,
      otp: otp,
      expiresAt: otpExpiry,
    });

    await sendMail(email, otp);
  }

  async verifyOtp(
    data: IUser & { otp: string }
  ): Promise<{ user: UserDTO; token: string; userRefreshToken: string }> {
    const otpRecord = await this._otpRepository.findOtpbyEmail(data.email);

    if (!otpRecord) throw new Error("OTP not found");

    if (otpRecord.otp !== data.otp) throw new Error("Invalid OTP");

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await this._userRepository.createUser({
      ...data,
      password: hashedPassword,
    });

    await this._otpRepository.deleteOtpbyEmail(data.email);

    const token = generateToken(user._id, user.email, "user");
    const userRefreshToken = generateRefreshToken(user._id, user.email, "user");

    return { user, token, userRefreshToken };
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ user: UserDTO; token: string; userRefreshToken: string }> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new Error("user doesn't exist");
    }

    if (user.isBlocked) {
      throw new Error("User is blocked");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid password");
    }

    const token = generateToken(user._id, user.email, "user");
    const userRefreshToken = generateRefreshToken(user._id, user.email, "user");

    return { user: toUserDTO(user), token, userRefreshToken };
  }

  async handleForgotPassword(email: string): Promise<void> {
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new Error("No user found");
    }

    const otp = generateOtp();

    await this._otpRepository.saveOTP({
      email: email,
      otp: otp,
      expiresAt: otpExpiry,
    });

    await sendMail(email, otp);
  }

  async verifyForgotOtp(data: {
    email: string;
    otp: string;
  }): Promise<boolean> {
    const otpRecord = await this._otpRepository.findOtpbyEmail(data.email);

    if (!otpRecord) {
      throw new Error("Couldn't find otp in email");
    }

    if (otpRecord.otp !== data.otp) {
      throw new Error("otp doesn't match");
    }

    return true;
  }

  async handleResetPassword(data: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<boolean> {
    const user = await this._userRepository.findByEmail(data.email);

    if (!user) {
      throw new Error("User not found");
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Password didn't match");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    user.password = hashedPassword;
    await user.save();

    return true;
  }

  async handleResendOtp(email: string): Promise<void> {
    const user = await this._otpRepository.findOtpbyEmail(email);

    if (!user) {
      throw new Error("NO user found");
    }

    const otp = generateOtp();

    await this._otpRepository.saveOTP({
      email: email,
      otp: otp,
      expiresAt: otpExpiry,
    });

    await sendMail(email, otp);
  }

  async getProfileByEmail(email: string): Promise<UserDTO> {
    const user = await this._userRepository.findForProfile(email);
    if (!user) {
      throw new Error("User not exist");
    }

    return toUserDTO(user);
  }

  async updateProfileService(
    email: string,
    {
      name,
      phone,
      profilePicture,
    }: { name?: string; phone?: string; profilePicture?: Express.Multer.File }
  ): Promise<UserDTO> {
    const updateFields: Partial<{
      name: string;
      phone: string;
      profilePicture: string;
    }> = { name, phone };

    if (profilePicture?.path) {
      const result = await cloudinary.uploader.upload(profilePicture.path, {
        folder: "profilePicture",
        use_filename: true,
        unique_filename: true,
      });

      updateFields.profilePicture = result.secure_url;
    }

    const user = await this._userRepository.updateUserByEmail(
      email,
      updateFields
    );

    if (!user) throw new Error("User not found");

    return toUserDTO(user);
  }

  async getCoursesService(
    page: number,
    limit: number,
    search: string,
    category: string,
    minPrice: number,
    maxPrice: number
  ): Promise<{ courses: CourseDTO[]; total: number; totalPages: number }> {
    const { courses, total, totalPages } =
      await this._courseRepository.findCourses(
        page,
        limit,
        search,
        category,
        minPrice,
        maxPrice
      );

    return { courses: toCourseDTOList(courses), total, totalPages };
  }

  async getCategory(): Promise<string[] | null> {
    return await this._categoryRepository.getCategory();
  }

  async findCourseByIdService(
    courseId: string,
    userId: string
  ): Promise<{ course: CourseDTO; isEnrolled: boolean }> {
    const course = await this._courseRepository.findCourseById(courseId);

    if (!course) {
      throw new Error("course not found");
    }

    const isEnrolled = await this._orderRepsitory.isUserEnrolled(
      courseId,
      userId
    );
    return {
      course: toCourseDTO(course),
      isEnrolled,
    };
  }

  async createOrder(courseId: string, userId: string): Promise<OrderDTO> {
    const course = await this._courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("Course dont't exist");
    }

    const existing = await this._orderRepsitory.findExistingOrder({
      userId,
      courseId,
      status: { $in: ["created", "paid"] },
    });

    if (existing) {
      throw new Error("Course is purchased or payment in progress");
    }

    const options = {
      amount: course.price * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    };

    const razorpayOrder = await razorpay.orders.create(options);

    const amount = course.price;

    const order = await this._orderRepsitory.createOrderRecord({
      userId,
      courseId,
      amount: amount,
      currency: "INR",
      razorpayOrderId: razorpayOrder.id,
      status: "created",
    });

    if (!order) {
      throw new Error("failed to create order");
    }

    return toOrderDTO(order);
  }

  async cancelOrder(orderId: string): Promise<OrderDTO> {
    const order = await this._orderRepsitory.getOrderById(orderId);
    if (!order) throw new Error("Order not found");

    if (order.status === "paid") throw new Error("Cannot cancel a paid order");
    const updated = await this._orderRepsitory.cancelOrder(orderId, "failed");
    if(!updated){
      throw new Error("failed to update the order")
    }
    return toOrderDTO(updated);
  }

  async retryPayment(orderId: string): Promise<OrderDTO> {
    const existingOrder = await this._orderRepsitory.getOrderById(orderId);
    if (!existingOrder) {
      throw new Error("Order not found");
    }
    if (existingOrder.status === "paid") {
      throw new Error("Order already paid");
    }
    const course = await this._courseRepository.findCourseById(
      existingOrder.courseId.toString()
    );
    if (!course) throw new Error("Course not found");
    const razorPayOrder = await razorpay.orders.create({
      amount: existingOrder.amount * 100,
      currency: "INR",
      receipt: `receipt_${Date.now()}`,
    });
    const updatedOrder = await this._orderRepsitory.updateOrderForRetry(
      existingOrder._id!.toString(),
      razorPayOrder.id
    );
    if(!updatedOrder){
      throw new Error("failed to retry the order")
    }
    return toOrderDTO(updatedOrder);
  }

  async verifyPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: boolean }> {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid signature");
    }

    const order =
      await this._orderRepsitory.getOrderByRazorpayId(razorpay_order_id);
    if (!order) throw new Error("Order not found");

    await this._orderRepsitory.markOrderAsPaid(order._id!);

    const user = await this._userRepository.findById(order.userId);

    await this._courseRepository.addEnrolledUser(
      order.courseId.toString(),
      order.userId.toString()
    );

    const course = await this._courseRepository.findCourseById(
      order.courseId?.toString()
    );

    if (!course || !course.instructor)
      throw new Error("Course or instructor not found");

    const instructorAmount = order.amount * 0.8;
    instructorAmount.toFixed(2);
    const adminCommission = order.amount * 0.2;
    adminCommission.toFixed(2);

    const courseId =
      typeof order.courseId === "string"
        ? order.courseId
        : (order.courseId as Types.ObjectId).toString();

    await this._walletRepository.creditWallet({
      ownerType: "instructors",
      ownerId: course.instructor._id.toString(),
      courseId: courseId,
      amount: instructorAmount,
      description: `Credited for the course named ${course.title} by ${user?.name}`,
    });

    await this._walletRepository.creditWallet({
      ownerType: "admin",
      courseId: courseId,
      amount: adminCommission,
      description: `Admin Commission for the course named ${course.title} by ${user?.name}`,
    });

    await this._notificationRepository.createNotification({
      receiverId: course.instructor.id.toString(),
      receiverModel: "Instructor",
      message: `Your course "${course.title}" was purchased by ${
        user?.name
      }. ₹${instructorAmount.toFixed(2)} has been credited to your wallet.`,
    });

    sendNotificationToUser(
      course.instructor.id.toString(),
      "you have new notification"
    );

    await this._notificationRepository.createNotification({
      receiverId: user?.id.toString(),
      receiverModel: "User",
      message: `Your Purchased course "${course.title}" of rupees ${course.price}`,
    });

    sendNotificationToUser(user?.id.toString(), "you have new notification");

    const admin = await this._adminRepository.findOneAdmin();
    if (admin) {
      await this._notificationRepository.createNotification({
        receiverId: admin.id,
        receiverModel: "Admin",
        message: `The course "${course.title}" was purchased by ${
          user?.name
        }. ₹${adminCommission.toFixed(2)} credited to the Admin wallet.`,
      });

      sendNotificationToUser(admin.id.toString(), "you have new notification");
    }

    return { success: true };
  }

  async getPreviousOrder(
    userId: string,
    courseId: string
  ): Promise<OrderDTO> {
    const order = await this._orderRepsitory.getPreviousOrder(userId, courseId);
    if(!order){
      throw new Error("failed to get previous order")
    }
    return toOrderDTO(order)
  }

  async updateLectureProgress(
    userId: string,
    courseId: string,
    lectureId: string
  ): Promise<ProgressDTO> {
    let progress = await this._progressRepository.findProgress(
      userId,
      courseId
    );
    if (!progress)
      progress = await this._progressRepository.createProgress(
        userId,
        courseId,
        lectureId
      );
    else {
      progress = await this._progressRepository.addWatchedLecture(
        userId,
        courseId,
        lectureId
      );
    }
    const course = await this._courseRepository.findCourseById(courseId);

    const totalLectures =
      course?.modules?.reduce((moduleAcc, mod) => {
        const chapterLectures = mod.chapters?.reduce(
          (chapAcc, chap) => chapAcc + (chap.lectures?.length ?? 0),
          0
        );
        return moduleAcc + (chapterLectures ?? 0);
      }, 0) ?? 0;

    if (
      totalLectures &&
      progress?.watchedLectures.length === totalLectures &&
      !progress?.isCompleted
    ) {
      await this._progressRepository.markAsCompleted(userId, courseId);
    }

    if (!progress) {
      throw new Error("failed to update progress");
    }

    return toProgressDTO(progress);
  }

  async getUserCourseProgress(
    userId: string,
    courseId: string
  ): Promise<ProgressDTO> {
    const progress = await this._progressRepository.findProgress(
      userId,
      courseId
    );
    if (!progress) {
      throw new Error("failed to fetch progress");
    }
    return toProgressDTO(progress);
  }

  async fetchPurchasedInstructors(userId: string): Promise<InstructorDTO[]> {
    const instructorIds =
      await this._courseRepository.findByPurchasedUser(userId);

    if (!instructorIds.length) return [];

    return this._instructorRepository.findInstructorsByIds(instructorIds);
  }

  async getNotifications(userId: string): Promise<NotificationDTO[]> {
    const notification =
      await this._notificationRepository.getAllNotifications(userId);
    return toNotificationDTOList(notification);
  }

  async markAsRead(notificationId: string): Promise<NotificationDTO> {
    const notification =
      await this._notificationRepository.updateNotification(notificationId);
    if (!notification) {
      throw new Error("failed to update notification");
    }
    return toNotificationDTO(notification);
  }

  async checkStatus(userId: string, courseId: string): Promise<boolean> {
    const { isCompleted } = await this._progressRepository.CheckStatus(
      userId,
      courseId
    );
    if (!isCompleted) {
      throw new Error("Course is not fully completed");
    }
    return isCompleted;
  }

  async submitComplaint(data: Partial<IComplaint>): Promise<ComplaintDTO> {
    const complaint = await this._complaintRepository.createComplaint(data);
    if (!complaint) {
      throw new Error("failed to submit complaint");
    }
    return toComplaintDTO(complaint);
  }

  async getPurchases(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ purchases: IPurchase[]; total: number; totalPages: number }> {
    const purchases = await this._orderRepsitory.getPurchases(
      userId,
      page,
      limit
    );
    return purchases;
  }

  async changePassword(
    userId: string,
    oldPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<void> {
    if (!oldPassword || !newPassword || !confirmPassword) {
      throw new Error("Please fill in all fields");
    }

    if (newPassword != confirmPassword) {
      throw new Error("new password and confirm password dont match");
    }

    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._userRepository.updatePassword(userId, hashedPassword);
  }

  async getSpecificInstructor(instructorId: string): Promise<InstructorDTO> {
    const instructor = await this._instructorRepository.findById(instructorId);
    if (!instructor) {
      throw new Error("No Instructor Found");
    }

    return toInstructorDTO(instructor);
  }

  async purchasedCourses(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    purchasedCourses: PurchasedCourse[];
    total: number;
    totalPages: number;
  }> {
    return await this._orderRepsitory.purchasedCourses(userId, page, limit);
  }

  async getCertificates(userId: string): Promise<
    {
      _id: string;
      user: string;
      course: string;
      courseTitle: string;
      certificateUrl: string;
      issuedDate: Date;
    }[]
  > {
    return await this._certificateRepository.getCertificates(userId);
  }

  async getQuiz(courseId: string): Promise<IQuiz | null> {
    if (!courseId) {
      throw new Error("no course found");
    }

    const quiz = await this._quizRepository.findQuizByCouseId(courseId);
    if (!quiz) {
      throw new Error("Quiz not found");
    }

    return quiz;
  }

  async submitQuiz(
    quizId: string,
    userId: string,
    courseId: string,
    answers: { [key: string]: string }
  ): Promise<{
    score: number;
    percentage: number;
    passed: boolean;
    isCertificateIssued: boolean;
  }> {
    const quiz = await this._quizRepository.findQuizById(quizId);
    if (!quiz) throw new Error("Quiz not found");

    let score = 0;

    quiz.questions.forEach((q: Question) => {
      if (!q._id) return;
      const selected = answers[q._id];
      const correct = q.options.find((o: Option) => o.isCorrect);
      if (selected && correct && selected === correct.text) {
        score++;
      }
    });

    const percentage = Math.floor((score / quiz.questions.length) * 100);
    const passed = percentage >= quiz.passPercentage;

    const isCertificateIssued = passed;

    await this._quizResultRepository.create({
      quizId,
      userId,
      courseId,
      answers,
      score,
      percentage,
      passed,
      isCertificateIssued: passed,
    });

    await this._progressRepository.makeCertificateIssued(
      userId,
      courseId,
      isCertificateIssued
    );

    return { score, percentage, passed, isCertificateIssued };
  }
}
