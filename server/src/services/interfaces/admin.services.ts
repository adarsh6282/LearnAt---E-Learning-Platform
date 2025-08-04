import { IAdmin } from "../../models/interfaces/admin.interface";
import { IUser } from "../../models/interfaces/auth.interface";
import { ICategory } from "../../models/interfaces/category.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IReview } from "../../models/interfaces/review.interface";
import { IWallet } from "../../models/interfaces/wallet.interface";
import { AdminLoginResponse } from "../../types/admin.types";
import { DashboardData } from "../../types/admin.types";
import { ITransaction } from "../../models/interfaces/wallet.interface";
import { IComplaint } from "../../models/interfaces/complaint.interface";
import { INotification } from "../../models/interfaces/notification.interface";

export interface IAdminService{
    login(email:string,password:string):Promise<AdminLoginResponse>,
    blockUnblockUser(email:string,blocked:boolean):Promise<IUser|null>
    blockUnblockTutor(email:string,blocked:boolean):Promise<IInstructor|null>,
    getDashboardData():Promise<DashboardData>
    getAllUsers(page:number,limit:number,search:string): Promise<{users:IUser[],total:number,totalPages:number}>,
    getAllTutors(page:number,limit:number,filter:any): Promise<{tutors:IInstructor[],total:number,totalPages:number}>,
    verifyTutor(email:string):Promise<IInstructor|null>,
    rejectTutor(email:string,reason:string):Promise<IInstructor|null>
    addCategory(name:string):Promise<ICategory|null>,
    getCategories():Promise<ICategory[]>,
    deleteCategory(id:string):Promise<ICategory|null>
    restoreCategory(id:string):Promise<ICategory|null>
    getCoursesService(skip:number,limit:number):Promise<ICourse[]>
    softDeleteCourseS(courseId:string):Promise<ICourse|null>
    recoverCourseS(courseId:string):Promise<ICourse|null>
    getAllReviews(page:number,limit:number): Promise<{reviews:IReview[],total:number,totalPages:number}>,
    hideReview(id:string):Promise<IReview|null>
    unhideReview(id:string):Promise<IReview|null>
    deleteReview(id:string):Promise<IReview|null>,
    getWallet(page:number,limit:number): Promise<{wallet:Partial<IWallet>,total:number,totalPages:number,transactions:ITransaction[]}>
    getComplaints():Promise<IComplaint[]|null>,
    responseComplaint(id:string,status:string,response:string):Promise<IComplaint|null>,
    getCourseStats():Promise<{title:string,enrolledCount:number}[]>,
    getIncomeStats():Promise<{month:string,revenue:number}[]>,
    getSpecificCourseForAdmin(courseId:string):Promise<ICourse|null>,
    getNotifications(userId:string):Promise<INotification[]>
    markAsRead(notificationId:string):Promise<INotification|null>
    getSpecificTutor(id:string):Promise<IInstructor|null>
}