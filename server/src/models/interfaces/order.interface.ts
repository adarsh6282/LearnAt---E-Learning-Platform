import { Types } from "mongoose";

export interface IOrder {
  _id?: string|Types.ObjectId
  courseId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  status: "created" | "paid" | "failed";
  currency?:string
  createdAt?: Date;
}