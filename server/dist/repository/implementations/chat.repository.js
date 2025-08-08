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
exports.ChatRepository = void 0;
const chatModel_1 = __importDefault(require("../../models/implementations/chatModel"));
class ChatRepository {
    findOrCreateChat(userId, instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            let chat = yield chatModel_1.default.findOne({ user: userId, instructor: instructorId });
            if (!chat) {
                chat = yield chatModel_1.default.create({ user: userId, instructor: instructorId });
            }
            return chat;
        });
    }
    getUsersChat(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chatModel_1.default.find({ user: userId }).populate("instructor", "name").sort({ lastMessage: -1 });
        });
    }
    getInstructorsChat(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return chatModel_1.default.find({ instructor: instructorId }).populate("user", "name").sort({ lastMessage: -1 });
        });
    }
}
exports.ChatRepository = ChatRepository;
