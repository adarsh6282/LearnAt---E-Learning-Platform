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
exports.ChatService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
class ChatService {
    constructor(_chatRepository) {
        this._chatRepository = _chatRepository;
    }
    sendMessage(from, fromModel, to, toModel, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._chatRepository.createMessage({
                from: new mongoose_1.default.Types.ObjectId(from),
                to: new mongoose_1.default.Types.ObjectId(to),
                fromModel,
                toModel,
                message,
            });
        });
    }
    getMessages(from, to) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this._chatRepository.getMessages(from, to);
        });
    }
    getChatList(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log(userId);
            return yield this._chatRepository.getChatPartners(userId);
        });
    }
}
exports.ChatService = ChatService;
