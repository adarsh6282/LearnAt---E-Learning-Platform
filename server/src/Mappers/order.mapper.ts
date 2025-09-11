import { OrderDTO } from "../DTO/order.dto";
import { IOrder } from "../models/interfaces/order.interface";

export const toOrderDTO = (order: IOrder): OrderDTO => ({
  _id: order._id?.toString(),
  courseId: order.courseId,
  userId: order.userId,
  razorpayOrderId: order.razorpayOrderId ?? undefined,
  razorpayPaymentId: order.razorpayPaymentId ?? undefined,
  razorpaySignature: order.razorpaySignature ?? undefined,
  amount: order.amount ?? 0,
  status: order.status,
  currency: order.currency ?? "INR",
});
