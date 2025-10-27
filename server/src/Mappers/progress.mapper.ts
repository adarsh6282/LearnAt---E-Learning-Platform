import { ProgressDTO } from "../DTO/progress.dto";
import { IProgress } from "../models/interfaces/progress.interface";

export const toProgressDTO = (progress: IProgress): ProgressDTO => ({
  _id: progress._id.toString(),
  userId: progress.userId,
  courseId: progress.courseId,
  watchedLectures: progress.watchedLectures ||[],
  isCompleted: progress.isCompleted,
  isCertificateIssued:progress.isCertificateIssued
});
