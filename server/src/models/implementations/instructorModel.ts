import mongoose,{Schema} from "mongoose";
import { IInstructor } from "../interfaces/instructorAuth.interface";

const instructorSchema:Schema<IInstructor>=new Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    username:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
        requirede:true,
        trim:true
    },
    phone:{
        type:String,
        required:true,
        trim:true
    },
    title:{
        type:String,
        required:true,
        trim:true
    },
    profilePicture:{
        type:String
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    yearsOfExperience:{
        type:Number,
        required:true,
    },
    resume:{
        type:String,
    },
    role:{
        type:String,
        enum:["user","instructor","admin"],
        default:"instructor"
    },
    education:{
        type:String,
        required:true,
        trim:true
    },
    accountStatus:{
        type:String,
        enum:["pending","blocked","active","rejected"],
        default:"pending"
    },
    isRejected:{
        type:Boolean,
    },
    isVerified:{
        type:Boolean,
        default:false   
    },
},
    {
        timestamps:true
    }
)

export default mongoose.model<IInstructor>("Instructor",instructorSchema)