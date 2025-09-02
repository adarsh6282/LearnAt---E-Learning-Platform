import { IOrder } from "../models/interfaces/order.interface";
import { Types } from "mongoose";

export interface OrderDTO {
  _id?: string;
  courseId: Types.ObjectId | string;
  userId: Types.ObjectId | string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  status: "created" | "paid" | "failed";
  currency?: string;
}
