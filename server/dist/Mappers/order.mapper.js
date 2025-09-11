"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOrderDTO = void 0;
const toOrderDTO = (order) => ({
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
exports.toOrderDTO = toOrderDTO;
