import { IAdminRepository } from "../interfaces/admin.interface";
import User from "../../models/implementations/userModel"
import Instructor from "../../models/implementations/instructorModel"
import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";


export class AdminRepository implements IAdminRepository{
    async getAllUsers(): Promise<IUser[]> {
        const users = await User.find({}).lean()
        return users as IUser[]
    }

    async getAllTutors(): Promise<IInstructor[]> {
        const instructors = await Instructor.find({}).lean()
        return instructors as IInstructor[]
    }
}