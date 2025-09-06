"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageRepository = void 0;
const messageModel_1 = __importDefault(require("../../models/implementations/messageModel"));
const chatModel_1 = __importDefault(require("../../models/implementations/chatModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class MessageRepository {
    async saveMessage(messageData) {
        const withReadBy = {
            ...messageData,
            readBy: [
                {
                    readerId: messageData.senderId,
                    readerModel: messageData.senderRole === "user" ? "User" : "Instructor",
                },
            ],
        };
        const message = await messageModel_1.default.create(withReadBy);
        await chatModel_1.default.findByIdAndUpdate(messageData.chat, {
            lastMessage: new Date(),
            lastMessageContent: message.content,
        });
        return message;
    }
    async getChatMessages(chatId) {
        return await messageModel_1.default.find({ chat: chatId }).sort({ createdAt: 1 });
    }
    async markMessagesAsRead(chatId, userId, userModel) {
        return await messageModel_1.default.updateMany({
            chat: chatId,
            "readBy.readerId": { $ne: userId },
        }, {
            $push: { readBy: { readerId: userId, readerModel: userModel } },
        });
    }
    async getUnreadCounts(userId, userModel) {
        const objectId = new mongoose_1.default.Types.ObjectId(userId);
        const messages = await messageModel_1.default.aggregate([
            {
                $match: {
                    "readBy.readerId": { $ne: objectId },
                    senderId: { $ne: objectId },
                },
            },
            {
                $group: {
                    _id: "$chat",
                    count: { $sum: 1 },
                },
            },
            {
                $lookup: {
                    from: "chats",
                    localField: "_id",
                    foreignField: "_id",
                    as: "chatData",
                },
            },
            { $unwind: "$chatData" },
            {
                $match: userModel === "User"
                    ? { "chatData.user": objectId }
                    : { "chatData.instructor": objectId },
            },
            {
                $project: {
                    chat: "$_id",
                    count: 1,
                    _id: 0,
                },
            },
        ]);
        return messages;
    }
}
exports.MessageRepository = MessageRepository;
