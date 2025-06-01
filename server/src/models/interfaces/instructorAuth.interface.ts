import { Document } from "mongoose";

export interface IInstructor extends Document{
    name:string,
    email:string,
    username:string,
    password:string,
    phone:string,
    title:string,
    yearsOfExperience:number,
    role:"user"|"admin"|"instructor"
    education:string,
    accountStatus:"pending"|"blocked"|"active",
    isVerified:boolean,
}