"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuizResultRepository = void 0;
const quizResultModel_1 = __importDefault(require("../../models/implementations/quizResultModel"));
class QuizResultRepository {
    async create(data) {
        const { quizId, userId, answers, score, percentage, passed, courseId, isCertificateIssued } = data;
        const quizResult = await quizResultModel_1.default.create({
            quizId,
            userId,
            courseId,
            answers,
            score,
            percentage,
            passed,
            isCertificateIssued,
            createdAt: new Date(),
        });
        const answersObj = {};
        quizResult.answers.forEach((value, key) => {
            answersObj[key] = value;
        });
        return {
            _id: quizResult._id.toString(),
            quizId: quizResult.quizId.toString(),
            userId: quizResult.userId.toString(),
            courseId: quizResult.courseId.toString(),
            answers: answersObj,
            score: quizResult.score,
            percentage: quizResult.percentage,
            passed: quizResult.passed,
            isCertificateIssued: quizResult.isCertificateIssued,
            createdAt: quizResult.createdAt,
        };
    }
}
exports.QuizResultRepository = QuizResultRepository;
