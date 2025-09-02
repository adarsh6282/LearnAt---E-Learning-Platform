"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toProgressDTO = void 0;
const toProgressDTO = (progress) => ({
    _id: progress._id.toString(),
    userId: progress.userId,
    courseId: progress.courseId,
    watchedLectures: Array.isArray(progress.watchedLectures)
        ? progress.watchedLectures
        : progress.watchedLectures
            ? [String(progress.watchedLectures)]
            : [],
    isCompleted: progress.isCompleted,
});
exports.toProgressDTO = toProgressDTO;
