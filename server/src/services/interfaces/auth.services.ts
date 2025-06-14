import { IUser } from "../../models/interfaces/auth.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { IOrder } from "../../models/interfaces/order.interface";

export interface IAuthService {
  registerUser(email: string): Promise<void>;
  loginUser(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string }>;
  verifyOtp(
    data: IUser & { otp: string }
  ): Promise<{ user: IUser; token: string }>;
  handleForgotPassword(email: string): Promise<void>;
  verifyForgotOtp(data: { email: string; otp: string }): Promise<boolean>;
  handleResetPassword(data: {
    email: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<boolean>;
  handleResendOtp(email: string): Promise<void>;
  getProfileByEmail(email: string): Promise<IUser | null>;
  updateProfileService(
    email: string,
    {
      name,
      phone,
      profilePicture,
    }: { name?: string; phone?: string; profilePicture?: Express.Multer.File }
  ): Promise<IUser | null>;
  getCoursesService(): Promise<ICourse[]>;
  findCourseByIdService(courseId: string,userId:string): Promise<{ course: ICourse; isEnrolled: boolean }>;
  createOrder(courseId: string, userId: string): Promise<IOrder | null>;
  verifyPayment({
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  }: {
    razorpay_order_id: string;
    razorpay_payment_id: string;
    razorpay_signature: string;
  }): Promise<{success:Boolean}>;
}
