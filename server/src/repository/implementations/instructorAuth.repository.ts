import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IInstructorAuthRepository } from "../interfaces/instructorAuth.interface";
import Instructor from "../../models/implementations/instructorModel"

export class InstructorAuth implements IInstructorAuthRepository{

    async createInstructor(userData: Partial<IInstructor>): Promise<IInstructor> {
       const instructor = await Instructor.create(userData)
       return instructor
    }

    async findByEmail(email: string): Promise<IInstructor | null> {
        const instructor = await Instructor.findOne({email})
        return instructor
    }

    async updateTutor(email: string, isVerified: boolean): Promise<IInstructor | null> {
        const tutor=await Instructor.findOneAndUpdate({email},{isVerified:true},{new:true})
        return tutor
    }

    async deleteTutor(email: string): Promise<IInstructor | null> {
        return await Instructor.findOneAndDelete({email})
    }
}