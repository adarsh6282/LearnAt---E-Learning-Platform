"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const orderModel_1 = __importDefault(require("../../models/implementations/orderModel"));
const mongoose_1 = require("mongoose");
class OrderRepository {
    createOrderRecord(orderData) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            const newOrder = yield orderModel_1.default.create(orderData);
            const plainOrder = newOrder.toObject();
            return {
                _id: plainOrder._id.toString(),
                courseId: plainOrder.courseId.toString(),
                userId: plainOrder.userId.toString(),
                amount: Number(plainOrder.amount),
                status: plainOrder.status,
                razorpayOrderId: (_a = plainOrder.razorpayOrderId) === null || _a === void 0 ? void 0 : _a.toString(),
                razorpayPaymentId: (_b = plainOrder.razorpayPaymentId) === null || _b === void 0 ? void 0 : _b.toString(),
                razorpaySignature: (_c = plainOrder.razorpaySignature) === null || _c === void 0 ? void 0 : _c.toString(),
                createdAt: plainOrder.createdAt,
            };
        });
    }
    markOrderAsPaid(orderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield orderModel_1.default.findByIdAndUpdate(orderId, { status: "paid" });
        });
    }
    getOrderByRazorpayId(razorpayOrderId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield orderModel_1.default.findOne({ razorpayOrderId });
        });
    }
    isUserEnrolled(courseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const order = yield orderModel_1.default.findOne({
                courseId: new mongoose_1.Types.ObjectId(courseId),
                userId: new mongoose_1.Types.ObjectId(userId),
                status: "paid",
            });
            return !!order;
        });
    }
}
exports.OrderRepository = OrderRepository;
