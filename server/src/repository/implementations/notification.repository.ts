import { INotification } from "../../models/interfaces/notification.interface";
import { INotificationRepository } from "../interfaces/notification.interface";
import Notification from "../../models/implementations/notificationModel"

export class NotificationRepository implements INotificationRepository{
    async createNotification(data:{receiverId:string,receiverModel:"User"|"Instructor"|"Admin",message:string}): Promise<INotification | null> {
        return await Notification.create(data)
    }

    async getAllNotifications(userId: string): Promise<INotification[]> {
        return await Notification.find({ receiverId:userId }).sort({ createdAt: -1 })
    }

    async updateNotification(notificationId: string): Promise<INotification|null> {
        return await Notification.findByIdAndUpdate(notificationId,{$set:{isRead:true}},{new:true})
    }
}