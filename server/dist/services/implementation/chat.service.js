"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatService = void 0;
class ChatService {
    constructor(_chatRepository) {
        this._chatRepository = _chatRepository;
    }
    async initiateChat(userId, instructorId) {
        return await this._chatRepository.findOrCreateChat(userId, instructorId);
    }
    async getChatList(userId, role) {
        return role === "user"
            ? await this._chatRepository.getUsersChat(userId)
            : await this._chatRepository.getInstructorsChat(userId);
    }
}
exports.ChatService = ChatService;
