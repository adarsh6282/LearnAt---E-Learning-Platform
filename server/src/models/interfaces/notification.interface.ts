import { Types } from "mongoose";

export interface INotification{
    receiverId:Types.ObjectId,
    receiverModel:string,
    message:string,
    isRead:boolean
}