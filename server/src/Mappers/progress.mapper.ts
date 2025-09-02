import { ProgressDTO } from "../DTO/progress.dto";
import { IProgress } from "../models/interfaces/progress.interface";

export const toProgressDTO = (progress: IProgress): ProgressDTO => ({
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
