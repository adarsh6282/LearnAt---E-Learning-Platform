"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageService = void 0;
const message_mapper_1 = require("../../Mappers/message.mapper");
class MessageService {
    constructor(_messageRepository) {
        this._messageRepository = _messageRepository;
    }
    async sendMessage(data) {
        const message = await this._messageRepository.saveMessage(data);
        if (!message) {
            throw new Error("failed to send message");
        }
        return (0, message_mapper_1.toMessageDTO)(message);
    }
    async fetchMessages(chatId) {
        const messages = await this._messageRepository.getChatMessages(chatId);
        if (!messages) {
            throw new Error("failed to fetch messages");
        }
        return (0, message_mapper_1.toMessageDTOList)(messages);
    }
    async markRead(chatId, userId, userModel) {
        return this._messageRepository.markMessagesAsRead(chatId, userId, userModel);
    }
    async deleteMessage(messageId, userId) {
        const message = await this._messageRepository.deleteMessage(messageId);
        if (!message) {
            throw new Error("Message not found");
        }
        if (message.senderId.toString() !== userId) {
            throw new Error("you can't delete this message");
        }
        return (0, message_mapper_1.toMessageDTO)(message);
    }
    async getUnreadCounts(userId, userModel) {
        return this._messageRepository.getUnreadCounts(userId, userModel);
    }
}
exports.MessageService = MessageService;
