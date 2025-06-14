import { Document } from "mongoose";

export interface IInstructor extends Document{
    _id:string,
    name:string,
    email:string,
    username:string,
    password:string,
    phone:string,
    title:string,
    isBlocked:boolean,
    yearsOfExperience:number,
    profilePicture?:string
    role:"user"|"admin"|"instructor"
    education:string,
    accountStatus:"pending"|"blocked"|"active",
    isVerified:boolean,
}