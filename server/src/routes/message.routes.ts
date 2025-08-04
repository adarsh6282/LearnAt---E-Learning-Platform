import { Router } from "express";
import { MessageController } from "../controllers/implementations/message.controller";
import { MessageService } from "../services/implementation/message.service";
import { MessageRepository } from "../repository/implementations/message.repository";
import upload from "../utils/multer";

const messageRepository=new MessageRepository()
const messageService=new MessageService(messageRepository)
const messageController=new MessageController(messageService)

const router=Router()

router.get("/:chatId",messageController.getMessages.bind(messageController))
router.post("/upload-image",upload.single("chatImage"),messageController.uploadImagesToChat.bind(messageController))

export default router