"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class ChatController {
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    async initChat(req, res) {
        try {
            const { userId, instructorId } = req.body;
            console.log(req.body);
            const chat = await this._chatService.initiateChat(userId, instructorId);
            res.status(statusCodes_1.httpStatus.OK).json(chat);
        }
        catch (err) {
            console.log(err);
        }
    }
    async getChatList(req, res) {
        try {
            const userId = req.params.id;
            const role = req.query.role;
            const chats = await this._chatService.getChatList(userId, role);
            res.status(statusCodes_1.httpStatus.OK).json(chats);
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.ChatController = ChatController;
