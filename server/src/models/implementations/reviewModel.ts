import { Schema } from "mongoose";
import mongoose from "mongoose";
import { IReview } from "../interfaces/review.interface";

const reviewSchema:Schema<IReview> = new Schema(
  {
    course: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    text: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IReview>("Review", reviewSchema);
