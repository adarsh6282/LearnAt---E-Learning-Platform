import Order from "../../models/implementations/orderModel";
import Progress from "../../models/implementations/progressModel";
import { IOrder } from "../../models/interfaces/order.interface";
import { IEnrollment } from "../../types/enrollment.types";
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
  ): Promise<IEnrollment[] | null> {
    const orders = await Order.find({ status: "paid" })
      .populate({
        path: "courseId",
        match: { instructor: instructorId },
        select: "_id title",
      })
      .populate("userId", "_id name email");

    const filteredOrders = orders.filter((order) => order.courseId !== null);

    const enrollments = await Promise.all(
      filteredOrders.map(async (order) => {
        const courseId = (order.courseId as any)._id;
        const userId = (order.userId as any)._id;

        const progress = await Progress.findOne({
          courseId,
          userId,
        });

        return {
          _id: order._id.toString(),
          course: {
            _id: courseId.toString(),
            title: (order.courseId as any).title,
          },
          user: {
            _id: userId.toString(),
            name: (order.userId as any).name,
            email: (order.userId as any).email,
          },
          isCompleted: progress?.isCompleted || false,
          createdAt: order.createdAt.toISOString(),
        };
      })
    );

    return enrollments;
  }

  async findExistingOrder(filter: {
    userId: string;
    courseId: string;
    status: { $in: string[] };
  }): Promise<IOrder | null> {
    return Order.findOne(filter);
  }
}
