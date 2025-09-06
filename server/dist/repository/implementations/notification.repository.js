"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const notificationModel_1 = __importDefault(require("../../models/implementations/notificationModel"));
class NotificationRepository {
    async createNotification(data) {
        return await notificationModel_1.default.create(data);
    }
    async getAllNotifications(userId) {
        return await notificationModel_1.default.find({ receiverId: userId }).sort({ createdAt: -1 });
    }
    async updateNotification(notificationId) {
        return await notificationModel_1.default.findByIdAndUpdate(notificationId, { $set: { isRead: true } }, { new: true });
    }
}
exports.NotificationRepository = NotificationRepository;
