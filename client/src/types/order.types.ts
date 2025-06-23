export interface IOrder {
  _id?: string;
  courseId: string;
  userId: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  amount: number;
  status: "created" | "paid" | "failed";
  currency?:string
  createdAt?: Date;
}

export interface VerifyResponse {
  success: boolean;
  order: IOrder;
}