import { IInstructorAuthService } from "../interfaces/instructorAuth.services";
import { IInstructorAuthRepository } from "../../repository/interfaces/instructorAuth.interface";
import { IInstructor } from "../../models/interfaces/instructorAuth.interface";
import bcrypt from "bcrypt"
import generateOtp, { otpExpiry } from "../../utils/otpGenerator";
import { IOtpRepository } from "../../repository/interfaces/otp.interface";
import { sendMail } from "../../utils/sendMail";


export class InstructorAuthSerivce implements IInstructorAuthService{
    constructor(private instructorAuthRepository:IInstructorAuthRepository,private otpRepository:IOtpRepository){
    }

    async registerInstructor(email: string): Promise<void> {
        const existing=await this.instructorAuthRepository.findByEmail(email)
        if(existing){
            throw new Error("Instructor already exists")
        }

        const otp=generateOtp()

        await this.otpRepository.saveOTP({
            email:email,
            otp:otp,
            expiresAt:otpExpiry
        })

        await sendMail(email,otp)
    }

    async verifyOtp(data: IInstructor & { otp: string; }): Promise<IInstructor> {

        const otpRecord = await this.otpRepository.findOtpbyEmail(data.email)
        console.log(data.otp)
        console.log(otpRecord?.otp)

        if(!otpRecord) throw new Error("OTP not found")
        
        if(otpRecord.otp!==data.otp){
            throw new Error("Invalid OTP")
        }

        const hashedPassword=await bcrypt.hash(data.password,10)

        const instructor=await this.instructorAuthRepository.createInstructor({
            ...data,
            password:hashedPassword
        })

        await this.otpRepository.deleteOtpbyEmail(data.email)

        return instructor
    }

    async loginInstructor(email: string, password: string): Promise<{ instructor: IInstructor}> {
        const instructor=await this.instructorAuthRepository.findByEmail(email)

        if(!instructor){
            throw new Error("Instructor not registered")
        }

        const isMatch=await bcrypt.compare(password,instructor.password)

        if(!isMatch){
            throw new Error("Passowrd doesn't match")
        }

        return {instructor}
    }

    async handleForgotPassword(email: string): Promise<void> {
        const instructor= await this.instructorAuthRepository.findByEmail(email)

        if(!instructor){
        throw new Error("No Instructor found")
        }

        const otp=generateOtp()

        await this.otpRepository.saveOTP({
            email:email,
            otp:otp,
            expiresAt:otpExpiry
        })

        await sendMail(email,otp)
    }

    async verifyForgotOtp(data: { email: string; otp: string; }): Promise<boolean> {
         const otpRecord =await this.otpRepository.findOtpbyEmail(data.email)

       if(!otpRecord){
        throw new Error("Couldn't find otp in email")
       }

       if(otpRecord.otp!==data.otp){
        throw new Error("otp doesn't match")
       }

       await this.otpRepository.deleteOtpbyEmail(data.email)

       return true
    }

    async handleResetPassword(data: { email: string; newPassword: string; confirmPassword: string; }): Promise<boolean> {
        const instructor=await this.instructorAuthRepository.findByEmail(data.email)
        
        if(!instructor){
        throw new Error("User not found")
        }

        if(data.newPassword!==data.confirmPassword){
        throw new Error("Password didn't match")
        }

        const hashedPassword=await bcrypt.hash(data.newPassword,10)

        instructor.password=hashedPassword
        await instructor.save()

        return true
    }

    async handleResendOtp(email: string): Promise<void> {
        const instructor=await this.otpRepository.findOtpbyEmail(email)
        
        if(!instructor){
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