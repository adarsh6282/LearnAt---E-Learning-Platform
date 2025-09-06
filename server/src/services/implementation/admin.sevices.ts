import { IAdminService } from "../interfaces/admin.services";
import { IAdminRepository } from "../../repository/interfaces/admin.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IInstructorAuthRepository } from "../../repository/interfaces/instructorAuth.interface";
import { IAuthRepository } from "../../repository/interfaces/auth.interface";
import { generateRefreshToken, generateToken } from "../../utils/jwt";
import { AdminLoginResponse, DashboardData } from "../../types/admin.types";
import { sendRejectionMail } from "../../utils/sendMail";
import { ICategory } from "../../models/interfaces/category.interface";
import { ICategoryRepository } from "../../repository/interfaces/category.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { ICourseRepository } from "../../repository/interfaces/course.interface";
import { IReviewRepository } from "../../repository/interfaces/review.interface";
import { IReview } from "../../models/interfaces/review.interface";
import {
  ITransaction,
  IWallet,
} from "../../models/interfaces/wallet.interface";
import { IWalletRepository } from "../../repository/interfaces/wallet.interface";
import { IComplaint } from "../../models/interfaces/complaint.interface";
import { IComplaintRepository } from "../../repository/interfaces/complaint.interface";
import { INotification } from "../../models/interfaces/notification.interface";
import { INotificationRepository } from "../../repository/interfaces/notification.interface";
import { UserDTO } from "../../DTO/user.dto";
import { toUserDTO, toUserDTOList } from "../../Mappers/user.mapper";
import { InstructorDTO } from "../../DTO/instructor.dto";
import { toInstructorDTO, toInstructorDTOList } from "../../Mappers/instructor.mapper";
import { CourseDTO } from "../../DTO/course.dto";
import { toCourseDTO, toCourseDTOList } from "../../Mappers/course.mapper";
import { CategoryDTO } from "../../DTO/category.dto";
import { toCategoryDTOList } from "../../Mappers/category.mapper";
import { ReviewDTO } from "../../DTO/review.dto";
import { toReviewDTOList } from "../../Mappers/review.mapper";
import { ComplaintDTO } from "../../DTO/complaint.dto";
import { toComplaintDTOList } from "../../Mappers/complaint.mapper";
import { NotificationDTO } from "../../DTO/notification.dto";
import { toNotificationDTOList } from "../../Mappers/notification.mapper";
import { FilterQuery } from "mongoose";

export class AdminService implements IAdminService {
  constructor(
    private _adminRepository: IAdminRepository,
    private _instructorRepository: IInstructorAuthRepository,
    private _userRepository: IAuthRepository,
    private _categoryRepository: ICategoryRepository,
    private _courseRepository: ICourseRepository,
    private _reviewRepository: IReviewRepository,
    private _walletRepository: IWalletRepository,
    private _complaintRepository: IComplaintRepository,
    private _notificationRepository: INotificationRepository
  ) {}

  async login(email: string, password: string): Promise<AdminLoginResponse> {
    const admin = await this._adminRepository.findAdminByEmail(email);

    if (!admin) {
      throw new Error("Admin not found");
    }

    if (admin.password !== password) {
      throw new Error("Password doesn't match");
    }

    const token = generateToken(admin._id.toString(), admin.email, "admin");
    const adminRefreshToken = generateRefreshToken(
      admin._id.toString(),
      admin.email,
      "admin"
    );

    return { token, email: admin.email, adminRefreshToken };
  }

  async blockUnblockUser(
    email: string,
    blocked: boolean
  ): Promise<UserDTO> {
    const user = await this._userRepository.findByEmail(email);
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }

    const updateUser= await this._adminRepository.updateUserBlockStatus(email, blocked);

    if (!updateUser) {
    throw new Error("Failed to update user");
  }
    return toUserDTO(updateUser)
  }

  async blockUnblockTutor(
    email: string,
    blocked: boolean
  ): Promise<InstructorDTO> {
    const tutor = await this._instructorRepository.findByEmail(email);
    console.log(tutor);
    if (!tutor) {
      throw new Error("Tutor not found");
    }

    const updateTutor = await this._adminRepository.updateTutorBlockStatus(email, blocked);
    if(!updateTutor){
      throw new Error("Failed to update tutor")
    }
    return toInstructorDTO(updateTutor)
  }

  async getAllUsers(
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: UserDTO[]; total: number; totalPages: number }> {
    const {users,total,totalPages} = await this._adminRepository.getAllUsers(page, limit, search);
    return {users:toUserDTOList(users),total,totalPages};
  }

  async getAllTutors(
    page: number,
    limit: number,
    filter: FilterQuery<IInstructor>
  ): Promise<{ tutors: InstructorDTO[]; total: number; totalPages: number }> {
    const {tutors,total,totalPages} = await this._adminRepository.getAllTutors(page, limit, filter);
    return {tutors:toInstructorDTOList(tutors),total,totalPages}
  }

  async verifyTutor(email: string): Promise<IInstructor | null> {
    return await this._instructorRepository.updateTutor(
      email,
      true,
      false,
      "active"
    );
  }

  async rejectTutor(
    email: string,
    reason: string
  ): Promise<IInstructor | null> {
    const instructor = await this._instructorRepository.findByEmail(email);

    if (!instructor) {
      throw new Error("Tutor not found");
    }

    instructor.isVerified = false;
    instructor.isRejected = true;
    instructor.accountStatus = "rejected";
    await sendRejectionMail(instructor.email, reason);
    return await instructor.save();
  }

  async getDashboardData(): Promise<DashboardData> {
    return await this._adminRepository.getDashboardData()
  }

  async addCategory(name: string): Promise<ICategory | null> {
    const category = await this._categoryRepository.findCategory(name);

    if (category) {
      throw new Error("Category already exists");
    }

    return await this._categoryRepository.createCategory(name);
  }

  async getCategories(
    page: number,
    limit: number,
    search: string,
    status: string
  ): Promise<{ category: CategoryDTO[]; total: number; totalPages: number }> {
    const {category,total,totalPages} = await this._categoryRepository.getCatgeories(
      page,
      limit,
      search,
      status
    );
    if (!category) {
      throw new Error("No categories found");
    }
    return {category:toCategoryDTOList(category),total,totalPages}
  }

  async deleteCategory(id: string): Promise<ICategory | null> {
    const category = await this._categoryRepository.findCategoryById(id);
    if (!category) {
      throw new Error("No category found");
    }
    return await this._categoryRepository.deleteCategory(id);
  }

  async restoreCategory(id: string): Promise<ICategory | null> {
    const category = await this._categoryRepository.findCategoryById(id);
    if (!category) {
      throw new Error("No category found");
    }
    return await this._categoryRepository.restoreCategory(id);
  }

  async getCoursesService(
    page: number,
    limit: number,
    search: string
  ): Promise<{ course: CourseDTO[]; total: number; totalPage: number }> {
    const {course,total,totalPage} = await this._courseRepository.findAllCourse(page, limit, search);
    return {course:toCourseDTOList(course),total,totalPage}
  }

  async softDeleteCourseS(courseId: string): Promise<ICourse | null> {
    return await this._courseRepository.updateCourseStatus(courseId, false);
  }

  async recoverCourseS(courseId: string): Promise<ICourse | null> {
    return await this._courseRepository.updateCourseStatus(courseId, true);
  }

  async getAllReviews(
    page: number,
    limit: number,
    search: string,
    rating: number|null,
    sort: string
  ): Promise<{ reviews: ReviewDTO[]; total: number; totalPages: number }> {
    const {reviews,total,totalPages} = await this._reviewRepository.getAllReviews(
      page,
      limit,
      search,
      rating,
      sort
    );
    

    return {reviews:toReviewDTOList(reviews),total,totalPages}
  }

  async hideReview(id: string): Promise<IReview | null> {
    const review = await this._reviewRepository.findReviewAndHide(id);

    if (!review) {
      throw new Error("Review not found");
    }

    return review;
  }

  async unhideReview(id: string): Promise<IReview | null> {
    const review = await this._reviewRepository.findReviewAndUnhide(id);

    if (!review) {
      throw new Error("Review not found");
    }

    return review;
  }

  async deleteReview(id: string): Promise<IReview | null> {
    const review = await this._reviewRepository.deleteReview(id);

    if (!review) {
      throw new Error("Review not found");
    }
    return review;
  }

  async getWallet(
    page: number,
    limit: number
  ): Promise<{
    wallet: Partial<IWallet>;
    total: number;
    totalPages: number;
    transactions: ITransaction[];
  }> {
    const { wallet, total, totalPages, transactions } =
      await this._walletRepository.findWalletOfAdmin(page, limit);
    return { wallet, total, totalPages, transactions };
  }

  async getComplaints(
    page: number,
    limit: number,
    search: string,
    filter: string
  ): Promise<{ complaints: ComplaintDTO[]; total: number; totalPages: number }> {
    const {complaints,total,totalPages} = await this._complaintRepository.getComplaints(
      page,
      limit,
      search,
      filter
    );
    return {complaints:toComplaintDTOList(complaints),total,totalPages}
  }

  async responseComplaint(
    id: string,
    status: string,
    response: string
  ): Promise<IComplaint | null> {
    if (!response || response.trim() == "") {
      throw new Error("Please fill in a response");
    }

    const complaint = await this._complaintRepository.updateComplaint(
      id,
      status,
      response
    );
    return complaint;
  }

  async getCourseStats(): Promise<{ title: string; enrolledCount: number }[]> {
    return await this._courseRepository.getCourseStats();
  }

  async getIncomeStats(): Promise<{ month: string; revenue: number }[]> {
    return await this._walletRepository.getIncomeStats();
  }

  async getSpecificCourseForAdmin(courseId: string): Promise<CourseDTO> {
    const course = await this._courseRepository.findCourseById(courseId);

    if (!course) {
      throw new Error("Course not found");
    }

    return toCourseDTO(course);
  }

  async getNotifications(userId: string): Promise<NotificationDTO[]> {
    const notification = await this._notificationRepository.getAllNotifications(userId);
    return toNotificationDTOList(notification)
  }

  async markAsRead(notificationId: string): Promise<INotification | null> {
    const notification = await this._notificationRepository.updateNotification(
      notificationId
    );
    return notification;
  }

  async getSpecificTutor(id: string): Promise<InstructorDTO> {
    const tutor = await this._instructorRepository.findById(id);

    if (!tutor) {
      throw new Error("Tutor not found");
    }

    return toInstructorDTO(tutor);
  }
}
