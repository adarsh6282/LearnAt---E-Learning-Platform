"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toMessageDTOList = exports.toMessageDTO = void 0;
const toMessageDTO = (message) => {
    return {
        _id: message._id?.toString(),
        chatId: message.chat.toString(),
        senderId: message.senderId.toString(),
        senderRole: message.senderRole,
        image: message.image,
        isDeleted: message.isDeleted,
        content: message.content,
        createdAt: message.createdAt,
    };
};
exports.toMessageDTO = toMessageDTO;
const toMessageDTOList = (messages) => {
    return messages.map(exports.toMessageDTO);
};
exports.toMessageDTOList = toMessageDTOList;
