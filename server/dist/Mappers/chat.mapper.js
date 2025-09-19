"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toChatDTOList = exports.toChatDTO = void 0;
const toChatDTO = (chat) => {
    return {
        _id: chat._id?.toString(),
        user: chat.user,
        instructor: chat.instructor,
        createdAt: chat.createdAt,
        lastMessage: chat.lastMessage,
        lastMessageContent: chat.lastMessageContent
    };
};
exports.toChatDTO = toChatDTO;
const toChatDTOList = (chats) => {
    return chats.map(exports.toChatDTO);
};
exports.toChatDTOList = toChatDTOList;
