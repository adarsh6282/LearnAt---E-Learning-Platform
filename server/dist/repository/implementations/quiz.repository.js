"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizRepository = void 0;
const quizModel_1 = __importDefault(require("../../models/implementations/quizModel"));
class QuizRepository {
    async createQuiz(quizData) {
        const quiz = await quizModel_1.default.create(quizData);
        return quiz;
    }
    async findQuizByCouseId(courseId) {
        const quiz = await quizModel_1.default.findOne({ courseId });
        return quiz;
    }
    async findQuizById(quizId) {
        return await quizModel_1.default.findById(quizId);
    }
    async findByInstructorId(instructor) {
        return quizModel_1.default.find({ instructorId: instructor }).populate("courseId", "title");
    }
    async changeStatus(quizId, isDeleted) {
        return await quizModel_1.default.findByIdAndUpdate(quizId, { isDeleted: isDeleted }, { new: true });
    }
    async updateQuizById(quizId, updateData) {
        return await quizModel_1.default.findByIdAndUpdate(quizId, { $set: updateData }, { new: true });
    }
}
exports.QuizRepository = QuizRepository;
