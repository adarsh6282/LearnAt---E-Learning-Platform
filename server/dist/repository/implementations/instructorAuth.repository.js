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
exports.InstructorAuth = void 0;
const instructorModel_1 = __importDefault(require("../../models/implementations/instructorModel"));
const courseModel_1 = __importDefault(require("../../models/implementations/courseModel"));
const base_repository_1 = require("../base.repository");
const orderModel_1 = __importDefault(require("../../models/implementations/orderModel"));
class InstructorAuth extends base_repository_1.BaseRepository {
    constructor() {
        super(instructorModel_1.default);
    }
    createInstructor(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.model.create(userData);
            return instructor;
        });
    }
    findByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.model.findOne({ email });
            return instructor;
        });
    }
    findById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.model.findById(id);
            return instructor;
        });
    }
    findInstructorsByIds(ids) {
        return __awaiter(this, void 0, void 0, function* () {
            return instructorModel_1.default.find({ _id: { $in: ids } });
        });
    }
    updateTutor(email, isVerified, isRejected, accountStatus) {
        return __awaiter(this, void 0, void 0, function* () {
            const tutor = yield this.model.findOneAndUpdate({ email }, { isVerified, accountStatus, isRejected }, { new: true });
            return tutor;
        });
    }
    deleteTutor(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.findOneAndDelete({ email });
        });
    }
    findForProfile(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const instructor = yield this.model.findOne({ email }).select("-password");
            return instructor;
        });
    }
    updateInstructorByEmail(email, updateFields) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedInstructor = yield this.model.findOneAndUpdate({ email }, { $set: updateFields }, { new: true });
            return updatedInstructor;
        });
    }
    updateInstructor(email, updatedData) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield instructorModel_1.default.findOneAndUpdate({ email }, { $set: updatedData }, { new: true });
        });
    }
    getDashboard(instructorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const courses = yield courseModel_1.default.find({ instructor: instructorId }).select("_id");
            const courseIds = courses.map((course) => course._id);
            const totalCourses = courseIds.length;
            const enrolledUserIds = yield orderModel_1.default.distinct("userId", {
                courseId: { $in: courseIds },
            });
            const totalUsers = enrolledUserIds.length;
            return {
                totalCourses,
                totalUsers,
            };
        });
    }
}
exports.InstructorAuth = InstructorAuth;
