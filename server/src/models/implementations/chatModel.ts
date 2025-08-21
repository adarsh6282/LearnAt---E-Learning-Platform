import mongoose,{Schema} from "mongoose";
import { IChat } from "../interfaces/chat.interface";

const chatSchema:Schema<IChat> = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "Instructor",
      required: true,
    },
    lastMessage:{
      type:Date,
      default:Date.now
    },
    lastMessageContent:{
      type:String
    }
  },
  {
    timestamps: true,
  }
);

chatSchema.index({ user: 1, instructor: 1 }, { unique: true });

export default mongoose.model("Chat", chatSchema);
