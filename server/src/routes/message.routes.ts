import { Router } from "express";
import upload from "../utils/multer";
import { messageController } from "../dependencyHandlers/message.dependencyhandler";
import { MESSAGE_ROUTES } from "../constants/routes";

const router=Router()

router.get(MESSAGE_ROUTES.GET_MESSAGES,messageController.getMessages.bind(messageController))
router.post(MESSAGE_ROUTES.UPLOAD_IMAGE,upload.single("chatImage"),messageController.uploadImagesToChat.bind(messageController))

export default router