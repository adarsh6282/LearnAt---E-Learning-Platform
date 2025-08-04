import { IProgress } from "../../models/interfaces/progress.interface";
import { IProgressRepository } from "../interfaces/progress.interface";
import Progress from "../../models/implementations/progressModel";

export class ProgressRepository implements IProgressRepository {
  async createProgress(
    userId: string,
    courseId: string,
    lectureId: string
  ): Promise<IProgress> {
    return Progress.create({
      userId,
      courseId,
      watchedLectures: [lectureId],
    });
  }

  async findProgress(
    userId: string,
    courseId: string
  ): Promise<IProgress | null> {
    return Progress.findOne({ userId, courseId });
  }

  async addWatchedLecture(
    userId: string,
    courseId: string,
    lectureId: string
  ): Promise<IProgress | null> {
    return Progress.findOneAndUpdate(
      { userId, courseId, watchedLectures: { $ne: lectureId } },
      { $push: { watchedLectures: lectureId } },
      { new: true }
    );
  }

  async markAsCompleted(userId: string, courseId: string): Promise<void> {
    await Progress.updateOne({userId:userId,courseId:courseId},{$set:{isCompleted:true}})
  }

  async CheckStatus(userId: string, courseId: string): Promise<{ isCompleted: boolean; }> {
    const progress=await Progress.findOne({userId:userId,courseId:courseId})

    if(!progress){
      return {isCompleted:false}
    }

    return {isCompleted:progress.isCompleted}
  }
}
