import { INotification } from "../../models/interfaces/notification.interface";

export interface INotificationRepository {
  createNotification(data: {
    receiverId: string;
    receiverModel: "User" | "Instructor" | "Admin";
    message: string;
  }): Promise<INotification | null>;
  getAllNotifications(userId:string):Promise<INotification[]>
  updateNotification(notificationId:string):Promise<INotification|null>
}
