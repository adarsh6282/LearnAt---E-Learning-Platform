import { InstructorDTO } from "../../DTO/instructor.dto";
import { IUser } from "../../models/interfaces/auth.interface";
import { ICategory } from "../../models/interfaces/category.interface";
import { ICourse } from "../../models/interfaces/course.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { INotification } from "../../models/interfaces/notification.interface";
import { IOrder } from "../../models/interfaces/order.interface";
import { IReview } from "../../models/interfaces/review.interface";
import { ITransaction, IWallet } from "../../models/interfaces/wallet.interface";
import { IEnrollment } from "../../types/enrollment.types";
interface Dashboard{
  totalUsers:number,
  totalCourses:number
}

export interface IInstructorAuthService{
    registerInstructor(email:string):Promise<void>
    loginInstructor(email:string,password:string):Promise<{instructor:IInstructor,token:string,instructorRefreshToken:string}>
    reApplyS(email: string, resume: string):Promise<IInstructor|null>
    verifyOtp(data:IInstructor&{otp:string}):Promise<{instructor:IInstructor,token:string,instructorRefreshToken:string}>,
    handleForgotPassword(email:string):Promise<void>,
    verifyForgotOtp(data:{email:string,otp:string}):Promise<boolean>,
    handleResetPassword(data:{email:string,newPassword:string,confirmPassword:string}):Promise<boolean>,
    handleResendOtp(email:string):Promise<void>,
    getProfileService(email:string):Promise<InstructorDTO>
    getReviewsByInstructor(instructorId:string,page:number,limit:number,rating:number):Promise<{reviews:IReview[],total:number,totalPages:number}>
    updateProfileService(
      email: string,
      {
        name,
        phone,
        title,
        yearsOfExperience,
        education,
        profilePicture,
      }: { name?: string; phone?: string; profilePicture?: Express.Multer.File ;title?:string;yearsOfExperience?:number,education?:string}
    ): Promise<InstructorDTO>
    getCoursesByInstructor(instructorId:string,page:number,limit:number,search:string):Promise<{courses:ICourse[],total:number,totalPages:number}>
    getCategory():Promise<ICategory[]|null>
    getCourseById(courseId:string):Promise<ICourse|null>
    getEnrollments(instructorId:string,page:number,limit:number,search:string,status:string):Promise<{enrollments:IEnrollment[],total:number;totalPages:number}>
    getWallet(instructorId:string,page:number,limit:number):Promise<{wallet:Partial<IWallet>,total:number,totalPages:number,transactions:ITransaction[]}>
    getCouresStats(instructorId:string):Promise<{title:string,enrolledCount:number}[]>
    getIncomeStats(instructorId:string):Promise<{month:string,revenue:number}[]>
    getNotifications(userId:string):Promise<INotification[]>
    markAsRead(notificationId:string):Promise<INotification|null>
    getPurchasedUsers(instructorId:string):Promise<IUser[]>
    getDashboard(instructorId:string):Promise<Dashboard|null>
}