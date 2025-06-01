import { IAuthService } from "../interfaces/auth.services"
import { IAuthRepository } from "../../repository/interfaces/auth.interface"
import { IUser } from "../../models/interfaces/auth.interface"
import generateOtp,{otpExpiry} from "../../utils/otpGenerator"
import { sendMail } from "../../utils/sendMail"
import bcrypt from "bcrypt"
import { IOtpRepository } from "../../repository/interfaces/otp.interface"


export class AuthService implements IAuthService{

    constructor(private userRepository:IAuthRepository,private otpRepository:IOtpRepository){
    }

    async registerUser(email: string): Promise<void> {
        const existingUser=await this.userRepository.findByEmail(email)
        
        if(existingUser) throw new Error("User already exists")

        const otp=generateOtp()

        await this.otpRepository.saveOTP({
            email:email,
            otp:otp,
            expiresAt:otpExpiry
        })

        await sendMail(email,otp)
    }

    async verifyOtp(data:IUser&{otp:string}): Promise<IUser> {

        const otpRecord = await this.otpRepository.findOtpbyEmail(data.email)

        if(!otpRecord) throw new Error("OTP not found")

        if(otpRecord.otp!==data.otp) throw new Error("Invalid OTP")

        const hashedPassword=await bcrypt.hash(data.password,10)

        const user=await this.userRepository.createUser({
            ...data,
            password:hashedPassword
        })

        await this.otpRepository.deleteOtpbyEmail(data.email)

        return user
    }

   async loginUser(email: string, password: string): Promise<{ user: IUser }> {
       const user=await this.userRepository.findByEmail(email)
       if(!user){
        throw new Error("user doesn't exist")
       }

       const isMatch=await bcrypt.compare(password,user.password)

       if(!isMatch){
        throw new Error("Invalid password")
       }

       return {user}
   }

   async handleForgotPassword(email: string): Promise<void> {
       const user= await this.userRepository.findByEmail(email)

       if(!user){
        throw new Error("No user found")
       }

       const otp=generateOtp()

       await this.otpRepository.saveOTP({
            email:email,
            otp:otp,
            expiresAt:otpExpiry
        })

       await sendMail(email,otp)
   }

   async verifyForgotOtp(data: {email:string,otp:string}): Promise<boolean> {
       const otpRecord =await this.otpRepository.findOtpbyEmail(data.email)

       if(!otpRecord){
        throw new Error("Couldn't find otp in email")
       }

       if(otpRecord.otp!==data.otp){
        throw new Error("otp doesn't match")
       }

       return true
   }

   async handleResetPassword(data: { email: string; newPassword: string; confirmPassword: string }): Promise<boolean> {
       const user=await this.userRepository.findByEmail(data.email)

       if(!user){
        throw new Error("User not found")
       }

       if(data.newPassword!==data.confirmPassword){
        throw new Error("Password didn't match")
       }

       const hashedPassword=await bcrypt.hash(data.newPassword,10)

       user.password=hashedPassword
       await user.save()

       return true
   }

   async handleResendOtp(email: string): Promise<void> {
       const user=await this.otpRepository.findOtpbyEmail(email)

       if(!user){
        throw new Error("NO user found")
       }

       const otp=generateOtp()

       await this.otpRepository.saveOTP({
        email:email,
        otp:otp,
        expiresAt:otpExpiry
       })

       await sendMail(email,otp)
   }
}