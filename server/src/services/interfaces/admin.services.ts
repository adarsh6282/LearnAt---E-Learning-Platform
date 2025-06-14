import { IAdmin } from "../../models/interfaces/admin.interface";
import { IUser } from "../../models/interfaces/auth.interface";
import { ICategory } from "../../models/interfaces/category.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { AdminLoginResponse } from "../../types/admin.types";
import { DashboardData } from "../../types/admin.types";

export interface IAdminService{
    login(email:string,password:string):Promise<AdminLoginResponse>,
    blockUnblockUser(email:string,blocked:boolean):Promise<IUser|null>
    blockUnblockTutor(email:string,blocked:boolean):Promise<IInstructor|null>,
    getDashboardData():Promise<DashboardData>
    getAllUsers():Promise<IUser[]>,
    getAllTutors():Promise<IInstructor[]>,
    verifyTutor(email:string):Promise<IInstructor|null>,
    rejectTutor(email:string,reason:string):Promise<IInstructor|null>
    addCategory(name:string):Promise<ICategory|null>,
    getCategories():Promise<ICategory[]>,
    deleteCategory(id:string):Promise<ICategory|null>
    restoreCategory(id:string):Promise<ICategory|null>
    getCoursesService(skip:number,limit:number):Promise<ICourse[]>
    softDeleteCourseS(courseId:string):Promise<ICourse|null>
    recoverCourseS(courseId:string):Promise<ICourse|null>
}