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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
class ChatController {
    constructor(_chatService) {
        this._chatService = _chatService;
    }
    initChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, instructorId } = req.body;
                console.log(req.body);
                const chat = yield this._chatService.initiateChat(userId, instructorId);
                res.status(statusCodes_1.httpStatus.OK).json(chat);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    getChatList(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const userId = req.params.id;
                const role = req.query.role;
                const chats = yield this._chatService.getChatList(userId, role);
                res.status(statusCodes_1.httpStatus.OK).json(chats);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.ChatController = ChatController;
