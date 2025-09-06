"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComplaintRepository = void 0;
const complaintSchema_1 = __importDefault(require("../../models/implementations/complaintSchema"));
class ComplaintRepository {
    async createComplaint(data) {
        return await complaintSchema_1.default.create(data);
    }
    async getComplaints(page, limit, search, filter) {
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
        const [complaints, total] = await Promise.all([
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
    }
    async updateComplaint(id, status, response) {
        return await complaintSchema_1.default.findByIdAndUpdate(id, {
            $set: { status: status, response: response },
        }, { new: true });
    }
}
exports.ComplaintRepository = ComplaintRepository;
