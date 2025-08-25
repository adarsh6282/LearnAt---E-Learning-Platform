import { Router } from "express";
import upload from "../utils/multer";
import { messageController } from "../dependencyHandlers/message.dependencyhandler";

const router=Router()

router.get("/:chatId",messageController.getMessages.bind(messageController))
router.post("/upload-image",upload.single("chatImage"),messageController.uploadImagesToChat.bind(messageController))

export default router