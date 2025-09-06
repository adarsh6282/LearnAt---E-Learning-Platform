import { IAdminRepository } from "../interfaces/admin.interface";
import User from "../../models/implementations/userModel";
import Instructor from "../../models/implementations/instructorModel";
import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IAdmin } from "../../models/interfaces/admin.interface";
import Admin from "../../models/implementations/adminModel";
import { BaseRepository } from "../base.repository";
import Course from "../../models/implementations/courseModel";
import { DashboardData } from "../../types/admin.types";
import { FilterQuery } from "mongoose";

export class AdminRepository
  extends BaseRepository<IAdmin>
  implements IAdminRepository
{
  constructor() {
    super(Admin);
  }
  async getAllUsers(page: number, limit: number, search: string): Promise<{ users: IUser[]; total: number; totalPages: number }> {
  const skip = (page - 1) * limit;

  const filter = search
    ? {
        name: { $regex: search, $options: "i" },
      }
    : {};

  const [users, total] = await Promise.all([
    User.find(filter).skip(skip).limit(limit).lean(),
    User.countDocuments(filter),
  ]);

  const totalPages = Math.ceil(total / limit);

  return { users, total, totalPages };
}

  async getAllTutors(
    page: number,
    limit: number,
    filter: FilterQuery<IInstructor>
  ): Promise<{ tutors: IInstructor[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const [tutors, total] = await Promise.all([
      Instructor.find(filter).skip(skip).limit(limit).lean(),
      Instructor.countDocuments(filter),
    ]);

    const totalPages=Math.ceil(total/limit)

    return { tutors, total, totalPages };
  }

  async findAdminByEmail(email: string): Promise<IAdmin | null> {
    return await this.model.findOne({ email });
  }

  async findOneAdmin(): Promise<IAdmin | null> {
    return await this.model.findOne()
  }

  async updateUserBlockStatus(
    email: string,
    blocked: boolean
  ): Promise<IUser | null> {
    return await User.findOneAndUpdate(
      { email },
      { isBlocked: blocked, updatedAt: new Date() },
      { new: true }
    );
  }

  async updateTutorBlockStatus(
    email: string,
    blocked: boolean
  ): Promise<IInstructor | null> {
    return await Instructor.findOneAndUpdate(
      { email },
      { isBlocked: blocked },
      { new: true }
    );
  }

  async getDashboardData(): Promise<DashboardData> {
    const [totalUsers,totalTutors,totalCourses]=await Promise.all([
      User.countDocuments(),
      Instructor.countDocuments(),
      Course.countDocuments()
    ])

    return {totalUsers,totalTutors,totalCourses}
  }
}
