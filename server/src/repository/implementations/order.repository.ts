import Order from "../../models/implementations/orderModel";
import Progress from "../../models/implementations/progressModel";
import { ICourse } from "../../models/interfaces/course.interface";
import { IOrder } from "../../models/interfaces/order.interface";
import { IEnrollment } from "../../types/enrollment.types";
import { IOrderRepository } from "../interfaces/order.interace";
import { Types } from "mongoose";

export interface IPurchase {
  _id: string | Types.ObjectId;
  course: string | Types.ObjectId;
  amount: number;
  purchasedAt: Date;
  status: string;
}

export interface PurchasedCourse {
  _id: string;
  title: string;
  description: string;
  price: number;
  purchasedAt: string;
  thumbnail: string;
}

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

  async getOrderById(orderId: string): Promise<IOrder | null> {
    return await Order.findById(orderId);
  }

  async cancelOrder(orderId: string, status: string): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(
      orderId,
      { status: status },
      { new: true }
    );
  }

  async updateOrderForRetry(
    orderId: string,
    newRazorpayOrderId: string
  ): Promise<IOrder | null> {
    return await Order.findByIdAndUpdate(
      orderId,
      {
        $set: {
          razorpayOrderId: newRazorpayOrderId,
          status: "created",
          updatedAt: new Date(),
        },
      },
      { new: true }
    );
  }

  async getPreviousOrder(
    userId: string,
    courseId: string
  ): Promise<IOrder | null> {
    return await Order.findOne({ userId, courseId });
  }

  async markOrderAsPaid(
    orderId: string | Types.ObjectId
  ): Promise<IOrder | null> {
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
    instructorId: string,
    page: number,
    limit: number,
    search: string,
    status: string
  ): Promise<{
    enrollments: IEnrollment[];
    total: number;
    totalPages: number;
  }> {
    const searchRegex = search ? new RegExp(search, "i") : null;

    const orders = await Order.find({ status: "paid" })
      .populate<{ courseId: ICourse }>({
        path: "courseId",
        match: { instructor: instructorId },
        select: "_id title",
      })
      .populate<{
        userId: { _id: Types.ObjectId; name: string; email: string };
      }>({
        path: "userId",
        select: "_id name email",
      });

    const filteredOrders = orders.filter((order) => {
      if (!order.courseId || !order.userId) return false;

      const course = order.courseId;
      const user = order.userId;

      if (!searchRegex) return true;

      return (
        course.title.match(searchRegex) ||
        user.name.match(searchRegex) ||
        user.email.match(searchRegex)
      );
    });

    const paginatedOrders = filteredOrders.slice(
      (page - 1) * limit,
      page * limit
    );

    let enrollments = await Promise.all(
      paginatedOrders.map(async (order) => {
        const course = order.courseId;
        const user = order.userId;

        const progress = await Progress.findOne({
          courseId: course._id,
          userId: user._id,
        });

        return {
          _id: order._id.toString(),
          course: {
            _id: course._id.toString(),
            title: course.title,
          },
          user: {
            _id: user._id.toString(),
            name: user.name,
            email: user.email,
          },
          isCompleted: progress?.isCompleted || false,
          createdAt: order.createdAt.toISOString(),
        };
      })
    );
    if (status) {
      enrollments = enrollments.filter((enroll) =>
        status === "complete" ? enroll.isCompleted : !enroll.isCompleted
      );
    }
    const finalTotal = enrollments.length;
    const finalTotalPages = Math.ceil(finalTotal / limit);

    return { enrollments, total: finalTotal, totalPages: finalTotalPages };
  }

  async findExistingOrder(filter: {
    userId: string;
    courseId: string;
    status: { $in: string[] };
  }): Promise<IOrder | null> {
    return Order.findOne(filter);
  }

  async getPurchases(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ purchases: IPurchase[]; total: number; totalPages: number }> {
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({
      userId: userId,
      status: "paid",
    });

    const orders = await Order.find({
      userId: userId,
      status: "paid",
    })
      .populate({
        path: "courseId",
        select: "title",
      })
      .skip(skip)
      .limit(limit);

    const purchases: IPurchase[] = orders.map((order) => ({
      _id: order._id.toString(),
      course: order.courseId,
      amount: order.amount ?? 0,
      purchasedAt: order.createdAt,
      status: order.status,
    }));

    return {
      purchases,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }

  async purchasedCourses(
    userId: string,
    page: number,
    limit: number
  ): Promise<{
    purchasedCourses: PurchasedCourse[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({
      userId,
      status: "paid",
    });

    const courses = await Order.find({
      userId,
      status: "paid",
    })
      .populate<{ courseId: ICourse }>({
        path: "courseId",
        select: "title description price createdAt thumbnail",
        match: { isActive: true },
      })
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const purchasedCourses: PurchasedCourse[] = courses
      .filter((order) => order.courseId)
      .map((order) => {
        const course = order.courseId;
        return {
          _id: course._id.toString(),
          title: course.title,
          description: course.description,
          price: course.price,
          purchasedAt: order.createdAt.toISOString(),
          thumbnail: course.thumbnail,
        };
      });

    return {
      purchasedCourses,
      total,
      totalPages: Math.ceil(total / limit),
    };
  }
}
