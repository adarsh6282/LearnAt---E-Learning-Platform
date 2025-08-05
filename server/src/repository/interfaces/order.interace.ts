import { IOrder } from "../../models/interfaces/order.interface";
import { IEnrollment } from "../../types/enrollment.types";
import { IPurchase } from "../implementations/order.repository";


export interface IOrderRepository{
    createOrderRecord(orderData:IOrder):Promise<IOrder|null>
    markOrderAsPaid(orderId:string):Promise<IOrder|null>
    getOrderByRazorpayId(razorpayOrderId:string):Promise<IOrder|null>
    isUserEnrolled(courseId: string, userId: string): Promise<boolean>
    getEnrollmentsByInstructor(instructorId:string):Promise<IEnrollment[]|null>
    findExistingOrder(filter:{userId:string,courseId:string,status:{$in:string[]}}):Promise<IOrder|null>
    getPurchases(userId: string, page: number, limit: number): Promise<{ purchases: IPurchase[]; total: number; totalPages: number }>
}