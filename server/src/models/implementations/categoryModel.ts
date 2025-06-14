import mongoose,{Schema} from "mongoose"
import { ICategory } from "../interfaces/category.interface"

const categorySchema:Schema<ICategory>=new Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
},
    {
        timestamps:true
    })

export default mongoose.model<ICategory>("Category",categorySchema)