"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatRepository = void 0;
const chatModel_1 = __importDefault(require("../../models/implementations/chatModel"));
class ChatRepository {
    async findOrCreateChat(userId, instructorId) {
        let chat = await chatModel_1.default.findOne({ user: userId, instructor: instructorId });
        if (!chat) {
            chat = await chatModel_1.default.create({ user: userId, instructor: instructorId });
        }
        return chat;
    }
    async getUsersChat(userId) {
        return chatModel_1.default.find({ user: userId }).populate("instructor", "name").sort({ lastMessage: -1 });
    }
    async getInstructorsChat(instructorId) {
        return chatModel_1.default.find({ instructor: instructorId }).populate("user", "name").sort({ lastMessage: -1 });
    }
}
exports.ChatRepository = ChatRepository;
