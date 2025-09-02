"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toNotificationDTOList = exports.toNotificationDTO = void 0;
const toNotificationDTO = (notification) => ({
    _id: notification._id.toString(),
    receiverId: notification.receiverId,
    receiverModel: notification.receiverModel,
    message: notification.message,
    isRead: notification.isRead,
});
exports.toNotificationDTO = toNotificationDTO;
const toNotificationDTOList = (notifications) => {
    return notifications.map(exports.toNotificationDTO);
};
exports.toNotificationDTOList = toNotificationDTOList;
