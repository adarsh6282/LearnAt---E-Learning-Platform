import mongoose,{Schema} from "mongoose"
import {IUser} from "../interfaces/auth.interface"


const userSchema:Schema<IUser>=new Schema({
    name:{
        type:String,
        trim:true
    },
    username:{
        type:String,
        required:false,
        trim:true
    },
    email:{
        type:String,
        required:true,
        trim:true
    },
    password:{
        type:String,
    },
    googleId:{
        type:String
    },
    phone:{
        type:String,
        sparse:true,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    profilePicture:{
        type:String
    },
    role:{
        type:String,
        enum:["user","admin","instructor"],
        default:"user"
    },
},
    {
        timestamps:true
    }
)

const userModel = mongoose.model<IUser>("User",userSchema)
export default userModel

export type userDocument=IUser

