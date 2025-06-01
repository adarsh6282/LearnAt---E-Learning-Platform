import { IUser } from "../../models/interfaces/auth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";

export interface IAdminRepository{
    getAllUsers():Promise<IUser[]>,
    getAllTutors():Promise<IInstructor[]>
}