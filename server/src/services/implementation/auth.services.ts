import { IAuthService } from "../interfaces/auth.services";
import { IAuthRepository } from "../../repository/interfaces/auth.interface";
import { IUser } from "../../models/interfaces/auth.interface";
import generateOtp, { otpExpiry } from "../../utils/otpGenerator";
import { sendMail } from "../../utils/sendMail";
import bcrypt from "bcrypt";
import { IOtpRepository } from "../../repository/interfaces/otp.interface";
import { IAdminRepository } from "../../repository/interfaces/admin.interface";
import { IInstructorAuthRepository } from "../../repository/interfaces/instructorAuth.interface";
import { generateToken } from "../../utils/jwt";
import cloudinary from "../../config/cloudinary.config";
import { ICourse } from "../../models/interfaces/course.interface";
import { ICourseRepository } from "../../repository/interfaces/course.interface";
import { IOrder } from "../../models/interfaces/order.interface";
import razorpay from "../../config/razorpay.config";
import { IOrderRepository } from "../../repository/interfaces/order.interace";
import crypto from "crypto";
import { Types } from "mongoose";
import { IProgress } from "../../models/interfaces/progress.interface";
import { IProgressRepository } from "../../repository/interfaces/progress.interface";
import { IWalletRepository } from "../../repository/interfaces/wallet.interface";

export class AuthService implements IAuthService {
  constructor(
    private _userRepository: IAuthRepository,
    private _otpRepository: IOtpRepository,
    private _adminRepository: IAdminRepository,
    private _instructorRepository: IInstructorAuthRepository,
    private _courseRepository: ICourseRepository,
    private _orderRepsitory: IOrderRepository,
    private _progressRepository: IProgressRepository,
    private _walletRepository: IWalletRepository
  ) {}

  async registerUser(email: string): Promise<void> {
    const existingAdmin = await this._adminRepository.findAdminByEmail(email);
    if (existingAdmin) {
      throw new Error(
        "This email is used by admin. Please register with new one"
      );
    }
    const existingInstructor = await this._instructorRepository.findByEmail(
      email
    );
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
  ): Promise<{ user: IUser; token: string }> {
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

    return { user, token };
  }

  async loginUser(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }> {
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

    return { user, token };
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

  async getProfileByEmail(email: string): Promise<IUser | null> {
    const user = await this._userRepository.findForProfile(email);
    if (!user) {
      throw new Error("User not exist");
    }

    return user;
  }

  async updateProfileService(
    email: string,
    {
      name,
      phone,
      profilePicture,
    }: { name?: string; phone?: string; profilePicture?: Express.Multer.File }
  ): Promise<IUser | null> {
    const updateFields: any = { name, phone };

    if (profilePicture?.path) {
      const result = await cloudinary.uploader.upload(profilePicture.path, {
        folder: "profilePicture",
        use_filename: true,
        unique_filename: true,
      });

      updateFields.profilePicture = (result as any).secure_url;
    }

    const user = await this._userRepository.updateUserByEmail(
      email,
      updateFields
    );

    if (!user) throw new Error("User not found");

    return user;
  }

  async getCoursesService(): Promise<ICourse[]> {
    return await this._courseRepository.findAll();
  }

  async findCourseByIdService(
    courseId: string,
    userId: string
  ): Promise<{ course: ICourse; isEnrolled: boolean }> {
    const course = await this._courseRepository.findCourseById(courseId);

    if (!course) {
      throw new Error("course not found");
    }

    const isEnrolled = await this._orderRepsitory.isUserEnrolled(
      courseId,
      userId
    );
    return {
      course: course.toObject(),
      isEnrolled,
    };
  }

  async createOrder(courseId: string, userId: string): Promise<IOrder | null> {
    const course = await this._courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("Course dont't exist");
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

    return order;
  }

  async verifyPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{ success: Boolean }> {
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET!)
      .update(body)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      throw new Error("Invalid signature");
    }

    const order = await this._orderRepsitory.getOrderByRazorpayId(
      razorpay_order_id
    );
    if (!order) throw new Error("Order not found");

    await this._orderRepsitory.markOrderAsPaid(order._id!);

    const course = await this._courseRepository.findCourseById(
      order.courseId!?.toString()
    );
    
    if (!course || !course.instructor)
      throw new Error("Course or instructor not found");

    const instructorAmount = order.amount * 0.8
    instructorAmount.toFixed(2)
    const adminCommission = order.amount * 0.2;
    adminCommission.toFixed(2)

    const courseId =
      typeof order.courseId === "string"
        ? order.courseId
        : (order.courseId as Types.ObjectId).toString();

    await this._walletRepository.creditWallet({
      ownerType: "instructors",
      ownerId: course.instructor._id.toString(),
      courseId: courseId,
      amount: instructorAmount,
      description: `Credited for the course named ${course.title}`,
    });

    await this._walletRepository.creditWallet({
      ownerType: "admin",
      courseId: courseId,
      amount: adminCommission,
      description: `Admin Commission for the course named ${course.title}`,
    });

    return { success: true };
  }

  async updateLectureProgress(
    userId: string,
    courseId: string,
    lectureId: string
  ): Promise<IProgress | null> {
    const existing = await this._progressRepository.findProgress(
      userId,
      courseId
    );
    if (!existing)
      return this._progressRepository.createProgress(
        userId,
        courseId,
        lectureId
      );
    return this._progressRepository.addWatchedLecture(
      userId,
      courseId,
      lectureId
    );
  }

  async getUserCourseProgress(
    userId: string,
    courseId: string
  ): Promise<string[]> {
    const progress = await this._progressRepository.findProgress(
      userId,
      courseId
    );
    return progress?.watchedLectures || [];
  }
}
