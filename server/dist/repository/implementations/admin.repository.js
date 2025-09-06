"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminRepository = void 0;
const userModel_1 = __importDefault(require("../../models/implementations/userModel"));
const instructorModel_1 = __importDefault(require("../../models/implementations/instructorModel"));
const adminModel_1 = __importDefault(require("../../models/implementations/adminModel"));
const base_repository_1 = require("../base.repository");
const courseModel_1 = __importDefault(require("../../models/implementations/courseModel"));
class AdminRepository extends base_repository_1.BaseRepository {
    constructor() {
        super(adminModel_1.default);
    }
    async getAllUsers(page, limit, search) {
        const skip = (page - 1) * limit;
        const filter = search
            ? {
                name: { $regex: search, $options: "i" },
            }
            : {};
        const [users, total] = await Promise.all([
            userModel_1.default.find(filter).skip(skip).limit(limit).lean(),
            userModel_1.default.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(total / limit);
        return { users, total, totalPages };
    }
    async getAllTutors(page, limit, filter) {
        const skip = (page - 1) * limit;
        const [tutors, total] = await Promise.all([
            instructorModel_1.default.find(filter).skip(skip).limit(limit).lean(),
            instructorModel_1.default.countDocuments(filter),
        ]);
        const totalPages = Math.ceil(total / limit);
        return { tutors, total, totalPages };
    }
    async findAdminByEmail(email) {
        return await this.model.findOne({ email });
    }
    async findOneAdmin() {
        return await this.model.findOne();
    }
    async updateUserBlockStatus(email, blocked) {
        return await userModel_1.default.findOneAndUpdate({ email }, { isBlocked: blocked, updatedAt: new Date() }, { new: true });
    }
    async updateTutorBlockStatus(email, blocked) {
        return await instructorModel_1.default.findOneAndUpdate({ email }, { isBlocked: blocked }, { new: true });
    }
    async getDashboardData() {
        const [totalUsers, totalTutors, totalCourses] = await Promise.all([
            userModel_1.default.countDocuments(),
            instructorModel_1.default.countDocuments(),
            courseModel_1.default.countDocuments()
        ]);
        return { totalUsers, totalTutors, totalCourses };
    }
}
exports.AdminRepository = AdminRepository;
