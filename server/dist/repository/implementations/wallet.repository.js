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
    findWalletOfInstructor(InstructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield walletModel_1.default.findOne({ ownerId: InstructorId });
        });
    }
    findWalletOfAdmin() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield walletModel_1.default.findOne({ ownerType: "admin" });
        });
    }
}
exports.WalletRepository = WalletRepository;
