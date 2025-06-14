import { IAdmin } from "../../models/interfaces/admin.interface";
import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";

export interface IAdminRepository{
    findAdminByEmail(email:string):Promise<IAdmin|null>,
    updateUserBlockStatus(email:string,blocked:boolean):Promise<IUser|null>
    updateTutorBlockStatus(email:string,blocked:boolean):Promise<IInstructor|null>
    getAllUsers():Promise<IUser[]>,
    getAllTutors():Promise<IInstructor[]>,
    getTotalUsers():Promise<number>,
    getTotalTutors():Promise<number>,
}