import { IInstructorAuthService } from "../interfaces/instructorAuth.services";
import { IInstructorAuthRepository } from "../../repository/interfaces/instructorAuth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import bcrypt from "bcrypt";
import generateOtp, { otpExpiry } from "../../utils/otpGenerator";
import { IOtpRepository } from "../../repository/interfaces/otp.interface";
import { IAuthRepository } from "../../repository/interfaces/auth.interface";
import { IAdminRepository } from "../../repository/interfaces/admin.interface";
import { sendMail } from "../../utils/sendMail";
import { generateToken } from "../../utils/jwt";
import cloudinary from "../../config/cloudinary.config";
import { ICourse } from "../../models/interfaces/course.interface";
import { ICourseRepository } from "../../repository/interfaces/course.interface";
import { IReview } from "../../models/interfaces/review.interface";
import { IReviewRepository } from "../../repository/interfaces/review.interface";
import { IOrder } from "../../models/interfaces/order.interface";
import { IOrderRepository } from "../../repository/interfaces/order.interace";
import { IWallet } from "../../models/interfaces/wallet.interface";
import { IWalletRepository } from "../../repository/interfaces/wallet.interface";

export class InstructorAuthSerivce implements IInstructorAuthService {
  constructor(
    private _instructorAuthRepository: IInstructorAuthRepository,
    private _otpRepository: IOtpRepository,
    private _adminRepository: IAdminRepository,
    private _userRepository: IAuthRepository,
    private _courseRepository: ICourseRepository,
    private _reviewRepository:IReviewRepository,
    private _orderRepository:IOrderRepository,
    private _walletRepository:IWalletRepository
  ) {}

  async registerInstructor(email: string): Promise<void> {
    const existingAdmin = await this._adminRepository.findAdminByEmail(email);
    if (existingAdmin) {
      throw new Error(
        "This email is used by admin. Please register with new one"
      );
    }
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new Error(
        "This email is used by user. Please register with new one"
      );
    }
    const existing = await this._instructorAuthRepository.findByEmail(email);
    if (existing) {
      throw new Error("Instructor already exists");
    }

    const otp = generateOtp();

    await this._otpRepository.saveOTP({
      email: email,
      otp: otp,
      expiresAt: otpExpiry,
    });

    await sendMail(email, otp);
  }

  async verifyOtp(
    data: IInstructor & { otp: string }
  ): Promise<{ instructor: IInstructor; token: string }> {
    const otpRecord = await this._otpRepository.findOtpbyEmail(data.email);

    if (!otpRecord) throw new Error("OTP not found");

    if (otpRecord.otp !== data.otp) {
      throw new Error("Invalid OTP");
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const instructor = await this._instructorAuthRepository.createInstructor({
      ...data,
      password: hashedPassword,
      resume: data.resume,
    });

    await this._otpRepository.deleteOtpbyEmail(data.email);

    const token = generateToken(instructor._id, instructor.email, "instructor");

    return { instructor, token };
  }

  async reApplyS(email: string, resume: string): Promise<IInstructor | null> {
    const instructor = await this._instructorAuthRepository.findByEmail(email);

    if (!instructor) throw new Error("Instructor not found");

    const updatedData: Partial<IInstructor> = {
      resume: resume,
      isVerified: false,
      isRejected: false,
      accountStatus: "pending",
    };

    return await this._instructorAuthRepository.updateInstructor(
      instructor.email,
      updatedData
    );
  }

  async loginInstructor(
    email: string,
    password: string
  ): Promise<{ instructor: IInstructor; token: string }> {
    const instructor = await this._instructorAuthRepository.findByEmail(email);

    if (!instructor) {
      throw new Error("Instructor not registered");
    }

    if (instructor.isBlocked) {
      throw new Error("Instructor is blocked");
    }

    const isMatch = await bcrypt.compare(password, instructor.password);

    if (!isMatch) {
      throw new Error("Passowrd doesn't match");
    }

    const token = generateToken(instructor._id, instructor.email, "instructor");

    return { instructor, token };
  }

  async handleForgotPassword(email: string): Promise<void> {
    const instructor = await this._instructorAuthRepository.findByEmail(email);

    if (!instructor) {
      throw new Error("No Instructor found");
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

    await this._otpRepository.deleteOtpbyEmail(data.email);

    return true;
  }

  async handleResetPassword(data: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<boolean> {
    const instructor = await this._instructorAuthRepository.findByEmail(
      data.email
    );

    if (!instructor) {
      throw new Error("User not found");
    }

    if (data.newPassword !== data.confirmPassword) {
      throw new Error("Password didn't match");
    }

    const hashedPassword = await bcrypt.hash(data.newPassword, 10);

    instructor.password = hashedPassword;
    await instructor.save();

    return true;
  }

  async handleResendOtp(email: string): Promise<void> {
    const instructor = await this._otpRepository.findOtpbyEmail(email);

    if (!instructor) {
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

  async getProfileService(email: string): Promise<IInstructor | null> {
    const instructor = await this._instructorAuthRepository.findForProfile(
      email
    );
    if (!instructor) {
      throw new Error("Inbstructor not exist");
    }

    return instructor;
  }

  async updateProfileService(
    email: string,
    {
      name,
      phone,
      title,
      yearsOfExperience,
      education,
      profilePicture,
    }: {
      name?: string;
      phone?: string;
      profilePicture?: Express.Multer.File;
      title?: string;
      yearsOfExperience?: number;
      education?: string;
    }
  ): Promise<IInstructor | null> {
    const updateFields: any = {
      name,
      phone,
      title,
      yearsOfExperience,
      education,
    };

    if (profilePicture?.path) {
      const result = await cloudinary.uploader.upload(profilePicture.path, {
        folder: "profilePicture",
        use_filename: true,
        unique_filename: true,
      });

      updateFields.profilePicture = (result as any).secure_url;
    }

    const instructor =
      await this._instructorAuthRepository.updateInstructorByEmail(
        email,
        updateFields
      );

    if (!instructor) throw new Error("Instructor not found");

    return instructor;
  }

  async getCoursesByInstructor(
    instructorId: string
  ): Promise<ICourse[] | null> {
    return await this._courseRepository.findCoursesByInstructor(instructorId);
  }

  async getCourseById(courseId: string): Promise<ICourse | null> {
    const course = await this._courseRepository.findCourseById(courseId);
    if (!course) {
      throw new Error("No Course Found");
    }
    return course;
  }

  async getReviewsByInstructor(instructorId: string): Promise<IReview[] | null> {
    return this._reviewRepository.getReviewsByInstructor(instructorId)
  }

  async getEnrollments(instructorId: string): Promise<IOrder[] | null> {
    const enrollments=await this._orderRepository.getEnrollmentsByInstructor(instructorId)
    return enrollments
  }

  async getWallet(instructorId: string): Promise<IWallet | null> {
    const wallet=await this._walletRepository.findWalletOfInstructor(instructorId)

    if(!wallet){
      throw new Error("No wallet found for the instructor")
    }

    return wallet
  }
}
