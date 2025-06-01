import {IUser} from "../../models/interfaces/auth.interface"

export interface IAuthService{
    registerUser(email:string):Promise<void>
    loginUser(email:string,password:string):Promise<{user:IUser}>
    verifyOtp(data:IUser&{otp:string}):Promise<IUser>,
    handleForgotPassword(email:string):Promise<void>,
    verifyForgotOtp(data:{email:string,otp:string}):Promise<boolean>,
    handleResetPassword(data:{email:string,newPassword:string,confirmPassword:string}):Promise<boolean>,
    handleResendOtp(email:string):Promise<void>
}