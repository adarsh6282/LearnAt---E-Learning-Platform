import { IOrder } from "../../models/interfaces/order.interface";


export interface IOrderRepository{
    createOrderRecord(orderData:IOrder):Promise<IOrder|null>
    markOrderAsPaid(orderId:string):Promise<IOrder|null>
    getOrderByRazorpayId(razorpayOrderId:string):Promise<IOrder|null>
    isUserEnrolled(courseId: string, userId: string): Promise<boolean>
}