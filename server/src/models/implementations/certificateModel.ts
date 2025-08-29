import mongoose,{Schema} from "mongoose";
import { ICertificate } from "../interfaces/certificate.interface";

const certificateSchema:Schema<ICertificate>=new Schema({
    user:{
        type:Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    course:{
        type:Schema.Types.ObjectId,
        ref:"Course",
        required:true
    },
    certificateUrl:{
        type:String,
        required:true
    },
    issuedDate:{
        type:Date,
        default:Date.now
    }
})

export default mongoose.model<ICertificate>("Certificate",certificateSchema)