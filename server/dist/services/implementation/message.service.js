"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
class MessageService {
    constructor(_messageRepository) {
        this._messageRepository = _messageRepository;
    }
    async sendMessage(data) {
        return this._messageRepository.saveMessage(data);
    }
    async fetchMessages(chatId) {
        return this._messageRepository.getChatMessages(chatId);
    }
    async markRead(chatId, userId, userModel) {
        return this._messageRepository.markMessagesAsRead(chatId, userId, userModel);
    }
    async getUnreadCounts(userId, userModel) {
        return this._messageRepository.getUnreadCounts(userId, userModel);
    }
}
exports.MessageService = MessageService;
