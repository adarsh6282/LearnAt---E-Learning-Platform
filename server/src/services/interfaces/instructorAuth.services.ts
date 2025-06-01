import { IInstructor } from "../../models/interfaces/instructorAuth.interface";

export interface IInstructorAuthService{
    registerInstructor(email:string):Promise<void>
    loginInstructor(email:string,password:string):Promise<{instructor:IInstructor}>
    verifyOtp(data:IInstructor&{otp:string}):Promise<IInstructor>,
    handleForgotPassword(email:string):Promise<void>,
    verifyForgotOtp(data:{email:string,otp:string}):Promise<boolean>,
    handleResetPassword(data:{email:string,newPassword:string,confirmPassword:string}):Promise<boolean>,
    handleResendOtp(email:string):Promise<void>
}