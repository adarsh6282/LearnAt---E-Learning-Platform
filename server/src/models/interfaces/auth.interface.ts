import {Document} from "mongoose"

export interface IUser extends Document{
    _id:string,
    name:string,
    username:string,
    email:string,
    password:string,
    googleId:string
    phone:string,
    isBlocked:boolean,
    profilePicture?:string
    role:"admin"|"user"|"instructor",
    createdAt:Date,
    updatedAt:Date
}