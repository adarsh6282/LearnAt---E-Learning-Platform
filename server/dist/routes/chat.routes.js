"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authRole_1 = __importDefault(require("../middlewares/authRole"));
const chat_dependencyhandler_1 = require("../dependencyHandlers/chat.dependencyhandler");
const router = (0, express_1.Router)();
router.post("/initiate", (0, authRole_1.default)(["user", "instructor"]), chat_dependencyhandler_1.chatController.initChat.bind(chat_dependencyhandler_1.chatController));
router.get("/list/:id", (0, authRole_1.default)(["user", "instructor"]), chat_dependencyhandler_1.chatController.getChatList.bind(chat_dependencyhandler_1.chatController));
exports.default = router;
