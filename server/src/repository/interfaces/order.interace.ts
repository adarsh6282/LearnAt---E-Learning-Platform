import { Types } from "mongoose";
import { IOrder } from "../../models/interfaces/order.interface";
import { IEnrollment } from "../../types/enrollment.types";
import {
  IPurchase,
  PurchasedCourse,
} from "../implementations/order.repository";

export interface IOrderRepository {
  createOrderRecord(orderData: IOrder): Promise<IOrder | null>;
  getOrderById(orderId:string):Promise<IOrder|null>
  cancelOrder(orderId:string,status:string,couponCode:string,amount:number,discountamount:number):Promise<IOrder|null>
  markOrderAsPaid(orderId: string|Types.ObjectId): Promise<IOrder | null>;
  getPreviousOrder(userId:string,courseId:string):Promise<IOrder|null>
  getOrderByRazorpayId(razorpayOrderId: string): Promise<IOrder | null>;
  updateOrderForRetry(orderId:string,updateFields:Partial<IOrder>):Promise<IOrder|null>
  isUserEnrolled(courseId: string, userId: string): Promise<boolean>;
  getEnrollmentsByInstructor(
    instructorId: string,
    page: number,
    limit: number,
    search:string,
    status:string
  ): Promise<{ enrollments: IEnrollment[]; total: number; totalPages: number }>;
  findExistingOrder(filter: {
    userId: string;
    courseId: string;
    status: { $in: string[] };
  }): Promise<IOrder | null>;
  getPurchases(
    userId: string,
    page: number,
    limit: number
  ): Promise<{ purchases: IPurchase[]; total: number; totalPages: number }>;
  purchasedCourses(userId: string,page:number,limit:number): Promise<{purchasedCourses:PurchasedCourse[],total:number,totalPages:number}>;
}
