import mongoose,{Schema} from "mongoose"
import { IOtp } from "../interfaces/otp.interface"

const otpSchema:Schema<IOtp>=new Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:"5m"
    }
})

export default mongoose.model<IOtp>("Otp",otpSchema)