import mongoose,{Schema} from "mongoose";
import { IProgress } from "../interfaces/progress.interface";

const courseProgressSchema:Schema<IProgress> = new Schema({
  userId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
     },

  courseId: {
     type: mongoose.Schema.Types.ObjectId,
      ref: "Course",
      required: true },

  watchedLectures: [{
     type: String 
    }],
}, { timestamps: true });

export default mongoose.model<IProgress>("CourseProgress", courseProgressSchema);
