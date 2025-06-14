import { IAdminService } from "../interfaces/admin.services";
import { IAdminRepository } from "../../repository/interfaces/admin.interface";
import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IInstructorAuthRepository } from "../../repository/interfaces/instructorAuth.interface";
// import { IAdmin } from "../../models/interfaces/admin.interface";
import { IAuthRepository } from "../../repository/interfaces/auth.interface";
import { generateToken } from "../../utils/generateToken";
import { AdminLoginResponse, DashboardData } from "../../types/admin.types";
import { sendRejectionMail } from "../../utils/sendMail";
import { ICategory } from "../../models/interfaces/category.interface";
import { ICategoryRepository } from "../../repository/interfaces/category.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { ICourseRepository } from "../../repository/interfaces/course.interface";

export class AdminService implements IAdminService {
  constructor(
    private _adminRepository: IAdminRepository,
    private _instructorRepository: IInstructorAuthRepository,
    private _userRepository: IAuthRepository,
    private _categoryRepository: ICategoryRepository,
    private _courseRepository:ICourseRepository
  ) {}

  async login(email: string, password: string): Promise<AdminLoginResponse> {
    const admin = await this._adminRepository.findAdminByEmail(email);

    if (!admin) {
      throw new Error("Admin not found");
    }

    if (admin.password !== password) {
      throw new Error("Password doesn't match");
    }

    const token = generateToken(admin._id.toString(),admin.email);

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
    return await this._instructorRepository.updateTutor(email, true,"active");
  }

  async rejectTutor(
    email: string,
    reason: string
  ): Promise<IInstructor | null> {
    const instructor = await this._instructorRepository.findByEmail(email);

    if (!instructor) {
      throw new Error("Tutor not found");
    }
    await sendRejectionMail(instructor.email, reason);
    return await this._instructorRepository.deleteTutor(instructor.email);
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
    return await this._courseRepository.updateCourseStatus(courseId,false)
  }

  async recoverCourseS(courseId: string): Promise<ICourse | null> {
    return await this._courseRepository.updateCourseStatus(courseId,true)
  }
}
