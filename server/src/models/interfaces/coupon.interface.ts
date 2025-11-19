import { Schema } from "mongoose";

export interface ICoupon extends Document {
  courseId: Schema.Types.ObjectId|string;
  code: string;
  discount: number;
  expiresAt: Date;
  maxUses: number;
  usedCount: number;
}