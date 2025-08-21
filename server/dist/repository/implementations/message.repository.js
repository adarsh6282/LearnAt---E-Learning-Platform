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
exports.MessageRepository = void 0;
const messageModel_1 = __importDefault(require("../../models/implementations/messageModel"));
const chatModel_1 = __importDefault(require("../../models/implementations/chatModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class MessageRepository {
    saveMessage(messageData) {
        return __awaiter(this, void 0, void 0, function* () {
            const withReadBy = Object.assign(Object.assign({}, messageData), { readBy: [
                    {
                        readerId: messageData.senderId,
                        readerModel: messageData.senderRole === "user" ? "User" : "Instructor",
                    },
                ] });
            const message = yield messageModel_1.default.create(withReadBy);
            yield chatModel_1.default.findByIdAndUpdate(messageData.chat, {
                lastMessage: new Date(),
                lastMessageContent: message.content,
            });
            return message;
        });
    }
    getChatMessages(chatId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield messageModel_1.default.find({ chat: chatId }).sort({ createdAt: 1 });
        });
    }
    markMessagesAsRead(chatId, userId, userModel) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield messageModel_1.default.updateMany({
                chat: chatId,
                "readBy.readerId": { $ne: userId },
            }, {
                $push: { readBy: { readerId: userId, readerModel: userModel } },
            });
        });
    }
    getUnreadCounts(userId, userModel) {
        return __awaiter(this, void 0, void 0, function* () {
            const objectId = new mongoose_1.default.Types.ObjectId(userId);
            const messages = yield messageModel_1.default.aggregate([
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
        });
    }
}
exports.MessageRepository = MessageRepository;
