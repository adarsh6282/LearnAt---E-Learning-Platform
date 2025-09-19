import { Types } from "mongoose";

export interface ICertificate{
    _id:string|Types.ObjectId
    user:Types.ObjectId|string,
    course:Types.ObjectId|string,
    certificateUrl:string,
    issuedDate:Date
}