import { IAdminService } from "../interfaces/admin.services";
import { IAdminRepository } from "../../repository/interfaces/admin.interface";
import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IInstructorAuthRepository } from "../../repository/interfaces/instructorAuth.interface";


export class AdminService implements IAdminService{

    constructor(private adminRepository:IAdminRepository,private instructorRepository:IInstructorAuthRepository){}

    async getAllUsers(): Promise<IUser[]> {
        const users=await this.adminRepository.getAllUsers()
        return users
    }

    async getAllTutors(): Promise<IInstructor[]> {
        const instrcutors=await this.adminRepository.getAllTutors()
        return instrcutors
    }

    async verifyTutor(email: string): Promise<IInstructor | null> {
        return await this.instructorRepository.updateTutor(email,true)
    }

    async rejectTutor(email: string): Promise<IInstructor | null> {
        return await this.instructorRepository.deleteTutor(email)
    }
}