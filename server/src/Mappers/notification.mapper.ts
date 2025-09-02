import { NotificationDTO } from "../DTO/notification.dto";
import { INotification } from "../models/interfaces/notification.interface";

export const toNotificationDTO = (
  notification: INotification
): NotificationDTO => ({
  _id: notification._id.toString(),
  receiverId: notification.receiverId,
  receiverModel: notification.receiverModel,
  message:notification.message,
  isRead: notification.isRead,
});

export const toNotificationDTOList=(notifications:INotification[]):NotificationDTO[]=>{
    return notifications.map(toNotificationDTO)
}
