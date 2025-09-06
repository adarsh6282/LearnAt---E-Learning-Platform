"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.InstructorAuth = void 0;
const instructorModel_1 = __importDefault(require("../../models/implementations/instructorModel"));
const courseModel_1 = __importDefault(require("../../models/implementations/courseModel"));
const base_repository_1 = require("../base.repository");
const orderModel_1 = __importDefault(require("../../models/implementations/orderModel"));
class InstructorAuth extends base_repository_1.BaseRepository {
    constructor() {
        super(instructorModel_1.default);
    }
    async createInstructor(userData) {
        const instructor = await this.model.create(userData);
        return instructor;
    }
    async findByEmail(email) {
        const instructor = await this.model.findOne({ email });
        return instructor;
    }
    async findById(id) {
        const instructor = await this.model.findById(id);
        return instructor;
    }
    async findInstructorsByIds(ids) {
        return instructorModel_1.default.find({ _id: { $in: ids } });
    }
    async updateTutor(email, isVerified, isRejected, accountStatus) {
        const tutor = await this.model.findOneAndUpdate({ email }, { isVerified, accountStatus, isRejected }, { new: true });
        return tutor;
    }
    async deleteTutor(email) {
        return await this.model.findOneAndDelete({ email });
    }
    async findForProfile(email) {
        const instructor = await this.model.findOne({ email }).select("-password");
        return instructor;
    }
    async updateInstructorByEmail(email, updateFields) {
        const updatedInstructor = await this.model.findOneAndUpdate({ email }, { $set: updateFields }, { new: true });
        return updatedInstructor;
    }
    async updateInstructor(email, updatedData) {
        return await instructorModel_1.default.findOneAndUpdate({ email }, { $set: updatedData }, { new: true });
    }
    async getDashboard(instructorId) {
        const courses = await courseModel_1.default.find({ instructor: instructorId }).select("_id");
        const courseIds = courses.map((course) => course._id);
        const totalCourses = courseIds.length;
        const enrolledUserIds = await orderModel_1.default.distinct("userId", {
            courseId: { $in: courseIds },
        });
        const totalUsers = enrolledUserIds.length;
        return {
            totalCourses,
            totalUsers,
        };
    }
}
exports.InstructorAuth = InstructorAuth;
