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
exports.ProgressRepository = void 0;
const progressModel_1 = __importDefault(require("../../models/implementations/progressModel"));
class ProgressRepository {
    createProgress(userId, courseId, lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return progressModel_1.default.create({
                userId,
                courseId,
                watchedLectures: [lectureId],
            });
        });
    }
    findProgress(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            return progressModel_1.default.findOne({ userId, courseId });
        });
    }
    addWatchedLecture(userId, courseId, lectureId) {
        return __awaiter(this, void 0, void 0, function* () {
            return progressModel_1.default.findOneAndUpdate({ userId, courseId, watchedLectures: { $ne: lectureId } }, { $push: { watchedLectures: lectureId } }, { new: true });
        });
    }
    markAsCompleted(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield progressModel_1.default.updateOne({ userId: userId, courseId: courseId }, { $set: { isCompleted: true } });
        });
    }
    CheckStatus(userId, courseId) {
        return __awaiter(this, void 0, void 0, function* () {
            const progress = yield progressModel_1.default.findOne({ userId: userId, courseId: courseId });
            if (!progress) {
                return { isCompleted: false };
            }
            return { isCompleted: progress.isCompleted };
        });
    }
}
exports.ProgressRepository = ProgressRepository;
