import { ICourse } from "../../models/interfaces/course.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";

export interface IInstructorAuthService{
    registerInstructor(email:string):Promise<void>
    loginInstructor(email:string,password:string):Promise<{instructor:IInstructor,token:string}>
    verifyOtp(data:IInstructor&{otp:string}):Promise<{instructor:IInstructor,token:string}>,
    handleForgotPassword(email:string):Promise<void>,
    verifyForgotOtp(data:{email:string,otp:string}):Promise<boolean>,
    handleResetPassword(data:{email:string,newPassword:string,confirmPassword:string}):Promise<boolean>,
    handleResendOtp(email:string):Promise<void>,
    getProfileService(email:string):Promise<IInstructor|null>
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
}