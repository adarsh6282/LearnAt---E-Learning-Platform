import { OrderDTO } from "../DTO/order.dto";
import { IOrder } from "../models/interfaces/order.interface";

export const toOrderDTO = (order: IOrder): OrderDTO => ({
  _id: order._id?.toString(),
  courseId: order.courseId,
  userId: order.userId,
  razorpayOrderId: order.razorpayOrderId,
  razorpayPaymentId: order.razorpayPaymentId,
  razorpaySignature: order.razorpaySignature,
  amount: order.amount,
  status: order.status,
  currency: order.currency,
});
