import mongoose, { Schema } from "mongoose";
import { ILiveSession } from "../interfaces/livesession.interface";

const LiveSessionSchema = new Schema<ILiveSession>({
  courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
  instructorId: {
    type: Schema.Types.ObjectId,
    ref: "Instructor",
    required: true,
  },
  roomId: { type: String, required: true },
  startTime: { type: Date, required: true },
  isLive: { type: Boolean, required: true },
  endTime:{ type: Date }
});

export default mongoose.model<ILiveSession>("LiveSession", LiveSessionSchema);
