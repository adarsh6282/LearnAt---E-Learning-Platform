"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toOrderDTO = void 0;
const toOrderDTO = (order) => {
    var _a;
    return ({
        _id: (_a = order._id) === null || _a === void 0 ? void 0 : _a.toString(),
        courseId: order.courseId,
        userId: order.userId,
        razorpayOrderId: order.razorpayOrderId,
        razorpayPaymentId: order.razorpayPaymentId,
        razorpaySignature: order.razorpaySignature,
        amount: order.amount,
        status: order.status,
        currency: order.currency,
    });
};
exports.toOrderDTO = toOrderDTO;
