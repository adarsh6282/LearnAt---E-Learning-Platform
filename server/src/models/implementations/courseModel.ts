import mongoose, { Schema } from "mongoose";
import { ICourse, IModule } from "../interfaces/course.interface";

const LectureSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  url: {
    type: String,
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
  },
  type: {
    type: String,
  },
});

const chapterSchema = new Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    lectures: [LectureSchema],
});


const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true },
  description: { type: String },
  chapters: [chapterSchema],
});


const courseSchema = new Schema<ICourse>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    thumbnail: { type: String },
    modules: [moduleSchema],
    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Instructor",
      required: false,
    },
    enrolledStudents: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<ICourse>("Course", courseSchema);
