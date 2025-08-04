"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepository = void 0;
const notificationModel_1 = __importDefault(require("../../models/implementations/notificationModel"));
class NotificationRepository {
    createNotification(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notificationModel_1.default.create(data);
        });
    }
    getAllNotifications(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notificationModel_1.default.find({ receiverId: userId }).sort({ createdAt: -1 });
        });
    }
    updateNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield notificationModel_1.default.findByIdAndUpdate(notificationId, { $set: { isRead: true } }, { new: true });
        });
    }
}
exports.NotificationRepository = NotificationRepository;
