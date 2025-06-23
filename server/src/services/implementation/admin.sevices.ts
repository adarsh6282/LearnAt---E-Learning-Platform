import { IAdminService } from "../interfaces/admin.services";
import { IAdminRepository } from "../../repository/interfaces/admin.interface";
import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IInstructorAuthRepository } from "../../repository/interfaces/instructorAuth.interface";
import { IAuthRepository } from "../../repository/interfaces/auth.interface";
import { generateToken } from "../../utils/jwt";
import { AdminLoginResponse, DashboardData } from "../../types/admin.types";
import { sendRejectionMail } from "../../utils/sendMail";
import { ICategory } from "../../models/interfaces/category.interface";
import { ICategoryRepository } from "../../repository/interfaces/category.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { ICourseRepository } from "../../repository/interfaces/course.interface";
import { IReviewRepository } from "../../repository/interfaces/review.interface";
import { IReview } from "../../models/interfaces/review.interface";
import { IWallet } from "../../models/interfaces/wallet.interface";
import { IWalletRepository } from "../../repository/interfaces/wallet.interface";

export class AdminService implements IAdminService {
  constructor(
    private _adminRepository: IAdminRepository,
    private _instructorRepository: IInstructorAuthRepository,
    private _userRepository: IAuthRepository,
    private _categoryRepository: ICategoryRepository,
    private _courseRepository: ICourseRepository,
    private _reviewRepository: IReviewRepository,
    private _walletRepository:IWalletRepository
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

    return { token, email: admin.email };
  }

  async blockUnblockUser(
    email: string,
    blocked: boolean
  ): Promise<IUser | null> {
    const user = await this._userRepository.findByEmail(email);
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }

    return await this._adminRepository.updateUserBlockStatus(email, blocked);
  }

  async blockUnblockTutor(
    email: string,
    blocked: boolean
  ): Promise<IInstructor | null> {
    const tutor = await this._instructorRepository.findByEmail(email);
    console.log(tutor);
    if (!tutor) {
      throw new Error("Tutor not found");
    }

    return await this._adminRepository.updateTutorBlockStatus(email, blocked);
  }

  async getAllUsers(): Promise<IUser[]> {
    const users = await this._adminRepository.getAllUsers();
    return users;
  }

  async getAllTutors(): Promise<IInstructor[]> {
    const instrcutors = await this._adminRepository.getAllTutors();
    return instrcutors;
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
    const totalUsers = await this._adminRepository.getTotalUsers();
    const totalTutors = await this._adminRepository.getTotalTutors();

    return { totalUsers, totalTutors };
  }

  async addCategory(name: string): Promise<ICategory | null> {
    const category = await this._categoryRepository.findCategory(name);

    if (category) {
      throw new Error("Category already exists");
    }

    return await this._categoryRepository.createCategory(name);
  }

  async getCategories(): Promise<ICategory[]> {
    const categories = await this._categoryRepository.getCatgeories();
    if (!categories) {
      throw new Error("No categories found");
    }
    return categories;
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

  async getCoursesService(): Promise<ICourse[]> {
    return await this._courseRepository.findAll();
  }

  async softDeleteCourseS(courseId: string): Promise<ICourse | null> {
    return await this._courseRepository.updateCourseStatus(courseId, false);
  }

  async recoverCourseS(courseId: string): Promise<ICourse | null> {
    return await this._courseRepository.updateCourseStatus(courseId, true);
  }

  async getAllReviews(): Promise<IReview[] | null> {
    return await this._reviewRepository.getAllReviews();
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
    const review=await this._reviewRepository.deleteReview(id)

    if(!review){
      throw new Error("Review not found")
    }
    return review
  }

  async getWallet(): Promise<IWallet | null> {
    const wallet=await this._walletRepository.findWalletOfAdmin()
    return wallet
  }
}
