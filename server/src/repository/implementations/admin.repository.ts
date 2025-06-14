import { IAdminRepository } from "../interfaces/admin.interface";
import User from "../../models/implementations/userModel"
import Instructor from "../../models/implementations/instructorModel"
import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IAdmin } from "../../models/interfaces/admin.interface";
import Admin from "../../models/implementations/adminModel"
import { BaseRepository } from "../base.repository";


export class AdminRepository extends BaseRepository<IAdmin> implements IAdminRepository{
    constructor(){
        super(Admin)
    }
    async getAllUsers(): Promise<IUser[]> {
        const users = await User.find({}).lean()
        return users as IUser[]
    }

    async getAllTutors(): Promise<IInstructor[]> {
        const instructors = await Instructor.find({}).lean()
        return instructors as IInstructor[]
    }

    async findAdminByEmail(email: string): Promise<IAdmin|null> {
        return await this.model.findOne({email})
    }

    async updateUserBlockStatus(email: string, blocked: boolean): Promise<IUser | null> {
        return await User.findOneAndUpdate({email},{isBlocked:blocked,updatedAt:new Date()},{new:true})
    }

    async updateTutorBlockStatus(email: string, blocked: boolean): Promise<IInstructor | null> {
        return await Instructor.findOneAndUpdate({email},{isBlocked:blocked},{new:true})
    }

    async getTotalUsers(): Promise<number> {
        return await User.countDocuments({})
    }

    async getTotalTutors(): Promise<number> {
        return await Instructor.countDocuments({})
    }

    
}