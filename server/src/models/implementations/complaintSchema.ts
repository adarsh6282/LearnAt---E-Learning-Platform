import mongoose,{Schema} from "mongoose";
import { IComplaint } from "../interfaces/complaint.interface";

const complaintSchema:Schema<IComplaint> = new Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    type: {
      type: String,
      enum: ["report", "complaint"],
    },

    subject: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      required: true,
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      default: null,
    },

    status: {
      type: String,
      enum: ["pending", "resolved", "rejected"],
      default: "pending",
    },

    response: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model<IComplaint>("Complaint", complaintSchema);
