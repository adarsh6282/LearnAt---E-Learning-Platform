import mongoose, { Schema } from "mongoose";
import { IMessage } from "../interfaces/chat.interface";

const messageSchema: Schema<IMessage> = new Schema(
  {
    chat: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    },
    senderId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    senderRole: {
      type: String,
      enum: ["user", "instructor"],
      required: true,
    },
    content: {
      type: String,
    },
    image:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Message", messageSchema);
