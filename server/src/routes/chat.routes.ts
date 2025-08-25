import { Router } from "express";
import authRole from "../middlewares/authRole";
import { chatController } from "../dependencyHandlers/chat.dependencyhandler";

const router=Router()

router.post("/initiate",authRole(["user","instructor"]),chatController.initChat.bind(chatController))
router.get("/list/:id",authRole(["user","instructor"]),chatController.getChatList.bind(chatController))

export default router