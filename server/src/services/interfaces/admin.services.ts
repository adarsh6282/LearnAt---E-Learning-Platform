import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IWallet } from "../../models/interfaces/wallet.interface";
import { AdminLoginResponse } from "../../types/admin.types";
import { DashboardData } from "../../types/admin.types";
import { ITransaction } from "../../models/interfaces/wallet.interface";
import { UserDTO } from "../../DTO/user.dto";
import { InstructorDTO } from "../../DTO/instructor.dto";
import { CourseDTO } from "../../DTO/course.dto";
import { CategoryDTO } from "../../DTO/category.dto";
import { ReviewDTO } from "../../DTO/review.dto";
import { ComplaintDTO } from "../../DTO/complaint.dto";
import { NotificationDTO } from "../../DTO/notification.dto";
import { FilterQuery } from "mongoose";

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
    filter: FilterQuery<IInstructor>
  ): Promise<{ tutors: InstructorDTO[]; total: number; totalPages: number }>;
  verifyTutor(email: string): Promise<InstructorDTO>;
  rejectTutor(email: string, reason: string): Promise<InstructorDTO>;
  addCategory(name: string): Promise<CategoryDTO>;
  getCategories(
    page: number,
    limit: number,
    search:string,
    status:string
  ): Promise<{ category: CategoryDTO[]; total: number; totalPages: number }>;
  deleteCategory(id: string): Promise<CategoryDTO>;
  restoreCategory(id: string): Promise<CategoryDTO>;
  getCoursesService(
    page: number,
    limit: number,
    search: string
  ): Promise<{ course: CourseDTO[]; total: number; totalPage: number }>;
  softDeleteCourseS(courseId: string): Promise<CourseDTO>;
  recoverCourseS(courseId: string): Promise<CourseDTO>;
  getAllReviews(
    page: number,
    limit: number,
    search:string,
    rating:number|null,
    sort:string,
  ): Promise<{ reviews: ReviewDTO[]; total: number; totalPages: number }>;
  hideReview(id: string): Promise<ReviewDTO>;
  unhideReview(id: string): Promise<ReviewDTO>;
  deleteReview(id: string): Promise<ReviewDTO>;
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
  ): Promise<ComplaintDTO>;
  getCourseStats(): Promise<{ title: string; enrolledCount: number }[]>;
  getIncomeStats(): Promise<{ month: string; revenue: number }[]>;
  getSpecificCourseForAdmin(courseId: string): Promise<CourseDTO>;
  getNotifications(userId: string): Promise<NotificationDTO[]>;
  markAsRead(notificationId: string): Promise<NotificationDTO>;
  getSpecificTutor(id: string): Promise<InstructorDTO>;
}
