import { ICourse } from "../../models/interfaces/course.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import { IOrder } from "../../models/interfaces/order.interface";
import { IReview } from "../../models/interfaces/review.interface";
import { IWallet } from "../../models/interfaces/wallet.interface";

export interface IInstructorAuthService{
    registerInstructor(email:string):Promise<void>
    loginInstructor(email:string,password:string):Promise<{instructor:IInstructor,token:string}>
    reApplyS(email: string, resume: string):Promise<IInstructor|null>
    verifyOtp(data:IInstructor&{otp:string}):Promise<{instructor:IInstructor,token:string}>,
    handleForgotPassword(email:string):Promise<void>,
    verifyForgotOtp(data:{email:string,otp:string}):Promise<boolean>,
    handleResetPassword(data:{email:string,newPassword:string,confirmPassword:string}):Promise<boolean>,
    handleResendOtp(email:string):Promise<void>,
    getProfileService(email:string):Promise<IInstructor|null>
    getReviewsByInstructor(instructorId:string):Promise<IReview[]|null>
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
    ): Promise<IInstructor | null>
    getCoursesByInstructor(instructorId:string):Promise<ICourse[]|null>
    getCourseById(courseId:string):Promise<ICourse|null>
    getEnrollments(instructorId:string):Promise<IOrder[]|null>
    getWallet(instructorId:string):Promise<IWallet|null>
}