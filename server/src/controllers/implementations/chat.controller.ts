import { Request, Response } from "express";
import { IChatService } from "../../services/interfaces/chat.services";
import { IChatController } from "../interfaces/chat.interface";
import { httpStatus } from "../../constants/statusCodes";

export class ChatController implements IChatController {
  constructor(private _chatService: IChatService) {}

  async initChat(req: Request, res: Response): Promise<void> {
    try {
      const { userId, instructorId } = req.body;
      console.log(req.body)
      const chat = await this._chatService.initiateChat(userId, instructorId);
      res.status(httpStatus.OK).json(chat);
    } catch (err) {
      console.log(err);
    }
  }

  async getChatList(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.params.id;
      const role = req.query.role as "user" | "instructor";
      const chats = await this._chatService.getChatList(userId, role);
      res.status(httpStatus.OK).json(chats);
    } catch (err) {
      console.log(err);
    }
  }
}
