import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";

export interface IAdminService{
    getAllUsers():Promise<IUser[]>,
    getAllTutors():Promise<IInstructor[]>,
    verifyTutor(email:string):Promise<IInstructor|null>,
    rejectTutor(email:string):Promise<IInstructor|null>
}