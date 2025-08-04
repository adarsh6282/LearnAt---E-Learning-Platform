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
    getMessages(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const chatId = req.params.chatId;
                const messages = yield this._messageService.fetchMessages(chatId);
                res.status(statusCodes_1.httpStatus.OK).json(messages);
            }
            catch (err) {
                console.log(err);
            }
        });
    }
    uploadImagesToChat(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const file = req.file;
                if (!file) {
                    res.status(statusCodes_1.httpStatus.BAD_REQUEST).json({ message: "File not found" });
                    return;
                }
                const result = yield cloudinary_config_1.default.uploader.upload(file === null || file === void 0 ? void 0 : file.path, {
                    folder: "chat_uploads",
                    resource_type: "auto"
                });
                fs_1.default.unlinkSync(file.path);
                res.status(statusCodes_1.httpStatus.OK).json({ message: "file uploaded", url: result.secure_url });
            }
            catch (err) {
                console.log(err);
            }
        });
    }
}
exports.MessageController = MessageController;
