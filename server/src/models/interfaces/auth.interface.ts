import {Document} from "mongoose"

export interface IUser extends Document{
    name:string,
    username:string,
    email:string,
    password:string,
    googleId:string
    phone:string,
    role:"admin"|"user"|"instructor",
    createdAt:Date,
    updatedAt:Date
}