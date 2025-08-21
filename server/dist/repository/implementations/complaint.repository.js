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
exports.ComplaintRepository = void 0;
const complaintSchema_1 = __importDefault(require("../../models/implementations/complaintSchema"));
class ComplaintRepository {
    createComplaint(data) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield complaintSchema_1.default.create(data);
        });
    }
    getComplaints(page, limit, search, filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const skip = (page - 1) * limit;
            const query = {};
            if (search) {
                query.$or = [
                    { subject: { $regex: search, $options: "i" } },
                ];
            }
            if (filter) {
                query.status = filter;
            }
            const [complaints, total] = yield Promise.all([
                complaintSchema_1.default.find(query)
                    .populate("userId", "name email")
                    .populate("targetId", "title")
                    .skip(skip)
                    .limit(limit),
                complaintSchema_1.default.countDocuments(query),
            ]);
            const totalPages = Math.ceil(total / limit);
            return {
                complaints,
                total,
                totalPages,
            };
        });
    }
    updateComplaint(id, status, response) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield complaintSchema_1.default.findByIdAndUpdate(id, {
                $set: { status: status, response: response },
            }, { new: true });
        });
    }
}
exports.ComplaintRepository = ComplaintRepository;
