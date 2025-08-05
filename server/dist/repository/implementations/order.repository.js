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
const progressModel_1 = __importDefault(require("../../models/implementations/progressModel"));
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
    getEnrollmentsByInstructor(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const orders = yield orderModel_1.default.find({ status: "paid" })
                .populate({
                path: "courseId",
                match: { instructor: instructorId },
                select: "_id title",
            })
                .populate("userId", "_id name email");
            const filteredOrders = orders.filter((order) => order.courseId !== null);
            const enrollments = yield Promise.all(filteredOrders.map((order) => __awaiter(this, void 0, void 0, function* () {
                const courseId = order.courseId._id;
                const userId = order.userId._id;
                const progress = yield progressModel_1.default.findOne({
                    courseId,
                    userId,
                });
                return {
                    _id: order._id.toString(),
                    course: {
                        _id: courseId.toString(),
                        title: order.courseId.title,
                    },
                    user: {
                        _id: userId.toString(),
                        name: order.userId.name,
                        email: order.userId.email,
                    },
                    isCompleted: (progress === null || progress === void 0 ? void 0 : progress.isCompleted) || false,
                    createdAt: order.createdAt.toISOString(),
                };
            })));
            return enrollments;
        });
    }
    findExistingOrder(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            return orderModel_1.default.findOne(filter);
        });
    }
    getPurchases(userId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const total = yield orderModel_1.default.countDocuments({
                userId: userId,
                status: "paid",
            });
            const orders = yield orderModel_1.default.find({
                userId: userId,
                status: "paid",
            })
                .populate({
                path: "courseId",
                select: "title",
            })
                .skip(skip)
                .limit(limit);
            const purchases = orders.map((order) => {
                var _a;
                return ({
                    _id: order._id.toString(),
                    course: order.courseId,
                    amount: (_a = order.amount) !== null && _a !== void 0 ? _a : 0,
                    purchasedAt: order.createdAt,
                    status: order.status,
                });
            });
            return {
                purchases,
                total,
                totalPages: Math.ceil(total / limit),
            };
        });
    }
}
exports.OrderRepository = OrderRepository;
