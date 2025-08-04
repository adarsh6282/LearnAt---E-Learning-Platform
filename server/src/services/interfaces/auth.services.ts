import { IUser } from "../../models/interfaces/auth.interface";
import { IComplaint } from "../../models/interfaces/complaint.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { INotification } from "../../models/interfaces/notification.interface";
import { IOrder } from "../../models/interfaces/order.interface";
import { IProgress } from "../../models/interfaces/progress.interface";

export interface IAuthService {
  registerUser(email: string): Promise<void>;
  loginUser(
    email: string,
    password: string
  ): Promise<{ user: IUser; token: string; userRefreshToken:string }>;
  verifyOtp(
    data: IUser & { otp: string }
  ): Promise<{ user: IUser; token: string,userRefreshToken:string }>;
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
  updateLectureProgress(userId:string,courseId:string,lectureId:string):Promise<IProgress|null>
  getUserCourseProgress(userId: string, courseId: string): Promise<string[]>,
  fetchPurchasedInstructors(userId:string):Promise<IInstructor[]|null>
  checkStatus(userId: string, courseId: string): Promise<boolean>,
  getNotifications(userId:string):Promise<INotification[]>
  markAsRead(notificationId:string):Promise<INotification|null>
  submitComplaint(data:Partial<IComplaint>):Promise<IComplaint|null>
}
