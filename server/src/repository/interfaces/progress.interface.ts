import { IProgress } from "../../models/interfaces/progress.interface";

export interface IProgressRepository {
  findProgress(userId: string, courseId: string): Promise<IProgress | null>;

  createProgress(
    userId: string,
    courseId: string,
    lectureId: string
  ): Promise<IProgress>;

  addWatchedLecture(
    userId: string,
    courseId: string,
    lectureId: string
  ): Promise<IProgress | null>;

  markAsCompleted(userId: string, courseId: string): Promise<void>;
  CheckStatus(userId: string, courseId: string): Promise<{isCompleted:boolean}>;
}
