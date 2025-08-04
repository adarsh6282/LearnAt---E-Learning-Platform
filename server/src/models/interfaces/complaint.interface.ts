import { Types } from "mongoose";

export interface IComplaint{
    userId:Types.ObjectId|string,
    type:string,
    subject:string,
    message:string,
    targetId?:Types.ObjectId,
    status:string,
    response:string
}