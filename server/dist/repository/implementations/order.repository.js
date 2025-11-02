"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrderRepository = void 0;
const orderModel_1 = __importDefault(require("../../models/implementations/orderModel"));
const progressModel_1 = __importDefault(require("../../models/implementations/progressModel"));
const mongoose_1 = require("mongoose");
class OrderRepository {
    async createOrderRecord(orderData) {
        const newOrder = await orderModel_1.default.create(orderData);
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
    async getOrderById(orderId) {
        return await orderModel_1.default.findById(orderId);
    }
    async cancelOrder(orderId, status) {
        return await orderModel_1.default.findByIdAndUpdate(orderId, { status: status }, { new: true });
    }
    async updateOrderForRetry(orderId, newRazorpayOrderId) {
        return await orderModel_1.default.findByIdAndUpdate(orderId, {
            $set: {
                razorpayOrderId: newRazorpayOrderId,
                status: "created",
                updatedAt: new Date(),
            },
        }, { new: true });
    }
    async getPreviousOrder(userId, courseId) {
        return await orderModel_1.default.findOne({ userId, courseId });
    }
    async markOrderAsPaid(orderId) {
        return await orderModel_1.default.findByIdAndUpdate(orderId, { status: "paid" });
    }
    async getOrderByRazorpayId(razorpayOrderId) {
        return await orderModel_1.default.findOne({ razorpayOrderId });
    }
    async isUserEnrolled(courseId, userId) {
        const order = await orderModel_1.default.findOne({
            courseId: new mongoose_1.Types.ObjectId(courseId),
            userId: new mongoose_1.Types.ObjectId(userId),
            status: "paid",
        });
        return !!order;
    }
    async getEnrollmentsByInstructor(instructorId, page, limit, search, status) {
        const searchRegex = search ? new RegExp(search, "i") : null;
        const orders = await orderModel_1.default.find({ status: "paid" })
            .populate({
            path: "courseId",
            match: { instructor: instructorId },
            select: "_id title",
        })
            .populate({
            path: "userId",
            select: "_id name email",
        });
        const filteredOrders = orders.filter((order) => {
            if (!order.courseId || !order.userId)
                return false;
            const course = order.courseId;
            const user = order.userId;
            if (!searchRegex)
                return true;
            return (course.title.match(searchRegex) ||
                user.name.match(searchRegex) ||
                user.email.match(searchRegex));
        });
        const paginatedOrders = filteredOrders.slice((page - 1) * limit, page * limit);
        let enrollments = await Promise.all(paginatedOrders.map(async (order) => {
            const course = order.courseId;
            const user = order.userId;
            const progress = await progressModel_1.default.findOne({
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
        }));
        if (status) {
            enrollments = enrollments.filter((enroll) => status === "complete" ? enroll.isCompleted : !enroll.isCompleted);
        }
        const finalTotal = enrollments.length;
        const finalTotalPages = Math.ceil(finalTotal / limit);
        return { enrollments, total: finalTotal, totalPages: finalTotalPages };
    }
    async findExistingOrder(filter) {
        return orderModel_1.default.findOne(filter);
    }
    async getPurchases(userId, page, limit) {
        const skip = (page - 1) * limit;
        const total = await orderModel_1.default.countDocuments({
            userId: userId,
            status: "paid",
        });
        const orders = await orderModel_1.default.find({
            userId: userId,
            status: "paid",
        })
            .populate({
            path: "courseId",
            select: "title",
        })
            .skip(skip)
            .limit(limit);
        const purchases = orders.map((order) => ({
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
    async purchasedCourses(userId, page, limit) {
        const skip = (page - 1) * limit;
        const total = await orderModel_1.default.countDocuments({
            userId,
            status: "paid",
        });
        const courses = await orderModel_1.default.find({
            userId,
            status: "paid",
        })
            .populate({
            path: "courseId",
            select: "title description price createdAt thumbnail",
            match: { isActive: true },
        })
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const purchasedCourses = courses
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
exports.OrderRepository = OrderRepository;
