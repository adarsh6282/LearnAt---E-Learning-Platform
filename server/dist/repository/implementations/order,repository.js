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
exports.getOrderByRazorpayId = exports.markOrderAsPaid = exports.createOrderRecord = void 0;
const orderModel_1 = __importDefault(require("../../models/implementations/orderModel"));
const createOrderRecord = (orderData) => __awaiter(void 0, void 0, void 0, function* () {
    const newOrder = new orderModel_1.default(orderData);
    return yield newOrder.save();
});
exports.createOrderRecord = createOrderRecord;
const markOrderAsPaid = (orderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield orderModel_1.default.findByIdAndUpdate(orderId, { status: "paid" });
});
exports.markOrderAsPaid = markOrderAsPaid;
const getOrderByRazorpayId = (razorpayOrderId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield orderModel_1.default.findOne({ razorpayOrderId });
});
exports.getOrderByRazorpayId = getOrderByRazorpayId;
