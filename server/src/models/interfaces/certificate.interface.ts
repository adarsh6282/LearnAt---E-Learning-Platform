import { Types } from "mongoose";

export interface ICertificate{
    user:Types.ObjectId|string,
    course:Types.ObjectId|string,
    certificateUrl:string,
    issuedDate:Date
}