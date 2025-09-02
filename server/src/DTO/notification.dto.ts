import { Types } from "mongoose";

export interface NotificationDTO{
    _id:string,
    receiverId:Types.ObjectId,
    receiverModel:string,
    message:string
    isRead:boolean
}