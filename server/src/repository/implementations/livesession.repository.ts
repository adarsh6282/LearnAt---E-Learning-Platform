import LiveSession from "../../models/implementations/liveSessionModel"
import { ILiveSession } from "../../models/interfaces/livesession.interface";
import { ILiveSessionRepository } from "../interfaces/livesession.interface";

export class LiveSessionRepository implements ILiveSessionRepository {
  async create(data: Partial<ILiveSession>):Promise<ILiveSession|null> {
    try {
  return await LiveSession.create(data);
} catch (err) {
  console.error("LiveSession create error:", err);
  throw err;
}
  }

  async findById(id: string):Promise<ILiveSession|null> {
    return await LiveSession.findById(id);
  }

  async findActiveByCourseId(courseId: string): Promise<ILiveSession | null> {
    return await LiveSession.findOne({
      courseId,
      endTime: { $exists: false },
    })
  }
}
