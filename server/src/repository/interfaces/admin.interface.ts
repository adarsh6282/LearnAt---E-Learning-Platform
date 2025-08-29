import { IAdmin } from "../../models/interfaces/admin.interface";
import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { DashboardData } from "../../types/admin.types";

export interface IAdminRepository {
  findAdminByEmail(email: string): Promise<IAdmin | null>;
  findOneAdmin():Promise<IAdmin|null>
  updateUserBlockStatus(email: string, blocked: boolean): Promise<IUser | null>;
  updateTutorBlockStatus(
    email: string,
    blocked: boolean
  ): Promise<IInstructor | null>;
  getAllUsers(
    page: number,
    limit: number,
    search: string
  ): Promise<{ users: IUser[]; total: number; totalPages: number }>;
  getAllTutors(
    page: number,
    limit: number,
    filter: any
  ): Promise<{ tutors: IInstructor[]; total: number; totalPages: number }>;
  getDashboardData():Promise<DashboardData>
}
