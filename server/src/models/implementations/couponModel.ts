import mongoose, { Schema } from "mongoose";
import { ICoupon } from "../interfaces/coupon.interface";

const couponSchema = new Schema<ICoupon>(
  {
    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },

    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 100,
    },

    instructorId:{
      type:Schema.Types.ObjectId,
      ref: "Instructor",
      required:true
    },

    expiresAt: {
      type: Date,
      required: true,
    },

    maxUses: {
      type: Number,
      required: true,
      min: 1,
    },

    usedCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model<ICoupon>("Coupon", couponSchema);
