import { LiveSessionDTO } from "../../DTO/livesession.dto";

export interface ILiveSessionService {
  createSession(
    courseId: string,
    instructorId: string,
    startTime: Date
  ): Promise<LiveSessionDTO>;
  generateToken(
    sessionId: string,
    userId: string,
    role: "user" | "instructor"
  ): Promise<{
    token: string;
    appId: string | undefined;
    roomId: string;
    userId: string;
    courseId:string
  }>;
  getLiveSessionByCourseId(courseId: string): Promise<LiveSessionDTO>;
  endSession(isLive: boolean,sessionId:string): Promise<LiveSessionDTO>;
}
