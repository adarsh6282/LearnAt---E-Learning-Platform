import { IOtpRepository } from "../interfaces/otp.interface";
import { IOtp } from "../../models/interfaces/otp.interface";
import Otp from "../../models/implementations/otpModel"

export class OtpRepository implements IOtpRepository{
    
    async saveOTP(data: { email: string; otp: string; }): Promise<IOtp|null> {
        let saveotp : IOtp|null
        const existing = await Otp.findOne({email:data.email})
        if(existing){
           saveotp= await Otp.findOneAndUpdate({email:data.email},{otp:data.otp,expiresAt:new Date()},{new:true})
        }else{
           saveotp= await Otp.create(data)
        }
        return saveotp
    }

    async findOtpbyEmail(email: string): Promise<IOtp | null> {
        const otp=await Otp.findOne({email})
        return otp
    }

    async deleteOtpbyEmail(email: string): Promise<void> {
        await Otp.findOneAndDelete({email})
    }
}