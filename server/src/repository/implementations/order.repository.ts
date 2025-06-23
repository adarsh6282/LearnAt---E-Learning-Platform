import Order from "../../models/implementations/orderModel";
import { IOrder } from "../../models/interfaces/order.interface";
import { IOrderRepository } from "../interfaces/order.interace";
import { Types } from "mongoose";

export class OrderRepository implements IOrderRepository {
  async createOrderRecord(orderData: IOrder): Promise<IOrder | null> {
    const newOrder = await Order.create(orderData);
    const plainOrder = newOrder.toObject();

    return {
      _id: plainOrder._id.toString(),
      courseId: plainOrder.courseId.toString(),
      userId: plainOrder.userId.toString(),
      amount: Number(plainOrder.amount),
      status: plainOrder.status,
      razorpayOrderId: plainOrder.razorpayOrderId?.toString(),
      razorpayPaymentId: plainOrder.razorpayPaymentId?.toString(),
      razorpaySignature: plainOrder.razorpaySignature?.toString(),
      createdAt: plainOrder.createdAt,
    };
  }

  async markOrderAsPaid(orderId: string): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(orderId, { status: "paid" });
  }

  async getOrderByRazorpayId(razorpayOrderId: string): Promise<IOrder | null> {
    return await Order.findOne({ razorpayOrderId });
  }

  async isUserEnrolled(courseId: string, userId: string): Promise<boolean> {
    const order = await Order.findOne({
      courseId: new Types.ObjectId(courseId),
      userId: new Types.ObjectId(userId),
      status: "paid",
    });

    return !!order;
  }

  async getEnrollmentsByInstructor(
    instructorId: string
  ): Promise<IOrder[] | null> {
    const orders = await Order.find({ status: "paid" })
      .populate({
        path: "courseId",
        match: { instructor: instructorId },
        select: "title",
      })
      .populate("userId", "name email");

    const filteredOrders = orders.filter((order) => order.courseId !== null);

    return filteredOrders.map((order) => ({
      _id: order._id.toString(),
      course: {
        title: (order.courseId as any).title,
      },
      user: {
        name: (order.userId as any).name,
        email: (order.userId as any).email,
      },
      createdAt: order.createdAt.toISOString(),
    })) as unknown as IOrder[];
  }
}
