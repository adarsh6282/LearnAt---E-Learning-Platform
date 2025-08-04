import mongoose, { Schema } from "mongoose";
import { INotification } from "../interfaces/notification.interface";

const notificationSchema: Schema<INotification> = new Schema(
  {
    receiverId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "receiverModel",
    },
    receiverModel: {
      type: String,
      enum: ["User", "Instructor","Admin"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<INotification>("Notification",notificationSchema)