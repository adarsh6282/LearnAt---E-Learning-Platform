"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
const chat_mapper_1 = require("../../Mappers/chat.mapper");
class ChatService {
    constructor(_chatRepository) {
        this._chatRepository = _chatRepository;
    }
    async initiateChat(userId, instructorId) {
        const chat = await this._chatRepository.findOrCreateChat(userId, instructorId);
        if (!chat) {
            throw new Error("failed to initiate chat");
        }
        return (0, chat_mapper_1.toChatDTO)(chat);
    }
    async getChatList(userId, role) {
        const chats = role === "user"
            ? await this._chatRepository.getUsersChat(userId)
            : await this._chatRepository.getInstructorsChat(userId);
        if (!chats) {
            throw new Error("failed to load chalist");
        }
        return (0, chat_mapper_1.toChatDTOList)(chats);
    }
}
exports.ChatService = ChatService;
