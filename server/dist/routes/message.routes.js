"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("../utils/multer"));
const message_dependencyhandler_1 = require("../dependencyHandlers/message.dependencyhandler");
const router = (0, express_1.Router)();
router.get("/:chatId", message_dependencyhandler_1.messageController.getMessages.bind(message_dependencyhandler_1.messageController));
router.post("/upload-image", multer_1.default.single("chatImage"), message_dependencyhandler_1.messageController.uploadImagesToChat.bind(message_dependencyhandler_1.messageController));
exports.default = router;
