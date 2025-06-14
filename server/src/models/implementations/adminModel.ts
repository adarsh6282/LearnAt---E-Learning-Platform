import mongoose, { Schema } from "mongoose";
import { IAdmin } from "../interfaces/admin.interface";

const adminSchema:Schema<IAdmin>=new Schema({
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    role:{
        type:String,
        enum:["user","instructor","admin"],
        default:"admin"
    }
})


export default mongoose.model<IAdmin>("admin",adminSchema)