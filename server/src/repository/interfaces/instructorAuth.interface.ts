import { IInstructor } from "../../models/interfaces/instructorAuth.interface"

export interface IInstructorAuthRepository{
    createInstructor(userData:Partial<IInstructor>):Promise<IInstructor>
    findByEmail(email:string):Promise<IInstructor|null>,
    updateTutor(email:string,isVerified:boolean):Promise<IInstructor|null>,
    deleteTutor(email:string):Promise<IInstructor|null>
}