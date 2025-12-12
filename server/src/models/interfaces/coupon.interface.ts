import { Schema } from "mongoose";

export interface ICoupon extends Document {
  courseId: Schema.Types.ObjectId|string;
  code: string;
  instructorId:Schema.Types.ObjectId|string
  discount: number;
  expiresAt: Date;
  maxUses: number;
  usedCount: number;
}