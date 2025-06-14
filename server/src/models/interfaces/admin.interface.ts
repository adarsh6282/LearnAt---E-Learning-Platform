import { Document } from "mongoose";

export interface IAdmin extends Document{
    _id:string
    email:string,
    password:string,
    role:"user"|"instructor"|"admin"
}