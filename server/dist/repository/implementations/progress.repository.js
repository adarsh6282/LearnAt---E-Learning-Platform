"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgressRepository = void 0;
const progressModel_1 = __importDefault(require("../../models/implementations/progressModel"));
class ProgressRepository {
    async createProgress(userId, courseId, lectureId) {
        return progressModel_1.default.create({
            userId,
            courseId,
            watchedLectures: [lectureId],
        });
    }
    async findProgress(userId, courseId) {
        return progressModel_1.default.findOne({ userId, courseId });
    }
    async addWatchedLecture(userId, courseId, lectureId) {
        return progressModel_1.default.findOneAndUpdate({ userId, courseId, watchedLectures: { $ne: lectureId } }, { $push: { watchedLectures: lectureId } }, { new: true });
    }
    async markAsCompleted(userId, courseId) {
        await progressModel_1.default.updateOne({ userId: userId, courseId: courseId }, { $set: { isCompleted: true } });
    }
    async CheckStatus(userId, courseId) {
        const progress = await progressModel_1.default.findOne({
            userId: userId,
            courseId: courseId,
        });
        if (!progress) {
            return { isCompleted: false };
        }
        return { isCompleted: progress.isCompleted };
    }
    async makeCertificateIssued(userId, courseId, isIssued) {
        await progressModel_1.default.findOneAndUpdate({ userId, courseId }, { $set: { isCertificateIssued: isIssued } }, { new: true });
    }
}
exports.ProgressRepository = ProgressRepository;
