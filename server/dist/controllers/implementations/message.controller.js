"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageController = void 0;
const statusCodes_1 = require("../../constants/statusCodes");
const cloudinary_config_1 = __importDefault(require("../../config/cloudinary.config"));
const fs_1 = __importDefault(require("fs"));
class MessageController {
    constructor(_messageService) {
        this._messageService = _messageService;
    }
    async getMessages(req, res) {
        try {
            const chatId = req.params.chatId;
            const messages = await this._messageService.fetchMessages(chatId);
            res.status(statusCodes_1.httpStatus.OK).json(messages);
        }
        catch (err) {
            console.log(err);
        }
    }
    async uploadImagesToChat(req, res) {
        try {
            const file = req.file;
            if (!file) {
                res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "File not found" });
                return;
            }
            const result = await cloudinary_config_1.default.uploader.upload(file?.path, {
                folder: "chat_uploads",
                resource_type: "auto"
            });
            fs_1.default.unlinkSync(file.path);
            res.status(statusCodes_1.httpStatus.OK).json({ message: "file uploaded", url: result.secure_url });
        }
        catch (err) {
            console.log(err);
        }
    }
}
exports.MessageController = MessageController;
