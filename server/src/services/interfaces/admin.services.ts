import { IUser } from "../../models/interfaces/auth.interface";
import { ICategory } from "../../models/interfaces/category.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IReview } from "../../models/interfaces/review.interface";
import { IWallet } from "../../models/interfaces/wallet.interface";
import { AdminLoginResponse } from "../../types/admin.types";
import { DashboardData } from "../../types/admin.types";
import { ITransaction } from "../../models/interfaces/wallet.interface";
import { IComplaint } from "../../models/interfaces/complaint.interface";
import { INotification } from "../../models/interfaces/notification.interface";
import { UserDTO } from "../../DTO/user.dto";
import { InstructorDTO } from "../../DTO/instructor.dto";
import { CourseDTO } from "../../DTO/course.dto";
import { CategoryDTO } from "../../DTO/category.dto";
import { ReviewDTO } from "../../DTO/review.dto";
import { ComplaintDTO } from "../../DTO/complaint.dto";
import { NotificationDTO } from "../../DTO/notification.dto";

export interface IAdminService {
  login(email: string, password: string): Promise<AdminLoginResponse>;
  blockUnblockUser(email: string, blocked: boolean): Promise<UserDTO>;
  blockUnblockTutor(
    email: string,
    blocked: boolean
  ): Promise<InstructorDTO>;
  getDashboardData(): Promise<DashboardData>;
  getAllUsers(
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: UserDTO[]; total: number; totalPages: number }>;
  getAllTutors(
    page: number,
    limit: number,
    filter: any
  ): Promise<{ tutors: InstructorDTO[]; total: number; totalPages: number }>;
  verifyTutor(email: string): Promise<IInstructor | null>;
  rejectTutor(email: string, reason: string): Promise<IInstructor | null>;
  addCategory(name: string): Promise<ICategory | null>;
  getCategories(
    page: number,
    limit: number,
    search:string,
    status:string
  ): Promise<{ category: CategoryDTO[]; total: number; totalPages: number }>;
  deleteCategory(id: string): Promise<ICategory | null>;
  restoreCategory(id: string): Promise<ICategory | null>;
  getCoursesService(
    page: number,
    limit: number,
    search: string
  ): Promise<{ course: CourseDTO[]; total: number; totalPage: number }>;
  softDeleteCourseS(courseId: string): Promise<ICourse | null>;
  recoverCourseS(courseId: string): Promise<ICourse | null>;
  getAllReviews(
    page: number,
    limit: number,
    search:string,
    rating:number|null,
    sort:string,
  ): Promise<{ reviews: ReviewDTO[]; total: number; totalPages: number }>;
  hideReview(id: string): Promise<IReview | null>;
  unhideReview(id: string): Promise<IReview | null>;
  deleteReview(id: string): Promise<IReview | null>;
  getWallet(
    page: number,
    limit: number
  ): Promise<{
    wallet: Partial<IWallet>;
    total: number;
    totalPages: number;
    transactions: ITransaction[];
  }>;
  getComplaints(
    page: number,
    limit: number,
    search: string,
    filter: string
  ): Promise<{ complaints: ComplaintDTO[]; total: number; totalPages: number }>;
  responseComplaint(
    id: string,
    status: string,
    response: string
  ): Promise<IComplaint | null>;
  getCourseStats(): Promise<{ title: string; enrolledCount: number }[]>;
  getIncomeStats(): Promise<{ month: string; revenue: number }[]>;
  getSpecificCourseForAdmin(courseId: string): Promise<CourseDTO>;
  getNotifications(userId: string): Promise<NotificationDTO[]>;
  markAsRead(notificationId: string): Promise<INotification | null>;
  getSpecificTutor(id: string): Promise<InstructorDTO>;
}
