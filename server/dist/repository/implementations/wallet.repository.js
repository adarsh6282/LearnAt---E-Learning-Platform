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
exports.WalletRepository = void 0;
const walletModel_1 = __importDefault(require("../../models/implementations/walletModel"));
const mongoose_1 = __importDefault(require("mongoose"));
class WalletRepository {
    creditWallet(_a) {
        return __awaiter(this, arguments, void 0, function* ({ ownerType, ownerId, amount, courseId, description, }) {
            const query = ownerType === "admin" ? { ownerType } : { ownerType, ownerId };
            return yield walletModel_1.default.findOneAndUpdate(query, {
                $inc: { balance: amount },
                $push: {
                    transactions: {
                        type: "credit",
                        amount,
                        courseId,
                        description,
                    },
                },
            }, { upsert: true, new: true });
        });
    }
    findWalletOfInstructor(InstructorId, page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const wallet = yield walletModel_1.default.findOne({ ownerId: InstructorId })
                .select("balance transactions")
                .lean();
            const allTransactions = (wallet === null || wallet === void 0 ? void 0 : wallet.transactions) || [];
            const total = allTransactions.length;
            const totalPages = Math.ceil(total / limit);
            const paginatedTransactions = allTransactions
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(skip, skip + limit);
            return {
                wallet: { balance: (wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0 },
                transactions: paginatedTransactions,
                total,
                totalPages,
            };
        });
    }
    findWalletOfAdmin(page, limit) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const wallet = yield walletModel_1.default.findOne({ ownerType: "admin" })
                .select("balance transactions")
                .lean();
            const allTransactions = (wallet === null || wallet === void 0 ? void 0 : wallet.transactions) || [];
            const total = allTransactions.length;
            const totalPages = Math.ceil(total / limit);
            const paginatedTransactions = allTransactions
                .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
                .slice(skip, skip + limit);
            return {
                wallet: { balance: (wallet === null || wallet === void 0 ? void 0 : wallet.balance) || 0 },
                transactions: paginatedTransactions,
                total,
                totalPages,
            };
        });
    }
    getIncomeStats() {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield walletModel_1.default.aggregate([
                { $match: { ownerType: "admin" } },
                { $unwind: "$transactions" },
                {
                    $group: {
                        _id: {
                            year: { $year: "$transactions.createdAt" },
                            month: { $month: "$transactions.createdAt" },
                        },
                        totalRevenue: { $sum: "$transactions.amount" },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [
                                {
                                    $arrayElemAt: [
                                        [
                                            "",
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec",
                                        ],
                                        "$_id.month",
                                    ],
                                },
                                " ",
                                { $toString: "$_id.year" },
                            ],
                        },
                        revenue: { $toDouble: "$totalRevenue" },
                    },
                },
            ]);
            return results.map((item) => ({
                month: item.month,
                revenue: Number(item.revenue),
            }));
        });
    }
    getIncome(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const results = yield walletModel_1.default.aggregate([
                {
                    $match: {
                        ownerType: "instructors",
                        ownerId: new mongoose_1.default.Types.ObjectId(instructorId),
                    },
                },
                { $unwind: "$transactions" },
                {
                    $group: {
                        _id: {
                            year: { $year: "$transactions.createdAt" },
                            month: { $month: "$transactions.createdAt" },
                        },
                        totalRevenue: { $sum: "$transactions.amount" },
                    },
                },
                { $sort: { "_id.year": 1, "_id.month": 1 } },
                {
                    $project: {
                        _id: 0,
                        month: {
                            $concat: [
                                {
                                    $arrayElemAt: [
                                        [
                                            "",
                                            "Jan",
                                            "Feb",
                                            "Mar",
                                            "Apr",
                                            "May",
                                            "Jun",
                                            "Jul",
                                            "Aug",
                                            "Sep",
                                            "Oct",
                                            "Nov",
                                            "Dec",
                                        ],
                                        "$_id.month",
                                    ],
                                },
                                " ",
                                { $toString: "$_id.year" },
                            ],
                        },
                        revenue: { $toDouble: "$totalRevenue" },
                    },
                },
            ]);
            return results.map((item) => ({
                month: item.month,
                revenue: Number(item.revenue),
            }));
        });
    }
}
exports.WalletRepository = WalletRepository;
