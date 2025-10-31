import { generateAgoraToken } from "../../utils/generateAgoraToken";
import { ILiveSessionRepository } from "../../repository/interfaces/livesession.interface";
import { sendNotificationToUser } from "../../socket/socket";
import { ICourseRepository } from "../../repository/interfaces/course.interface";
import { ILiveSessionService } from "../interfaces/livesession.interface";
import { LiveSessionDTO } from "../../DTO/livesession.dto";
import { toLivesessionDTO } from "../../Mappers/livesession.mapper";

export class LiveSessionService implements ILiveSessionService {
  constructor(
    private _livesessionRepository: ILiveSessionRepository,
    private _courseRepository: ICourseRepository
  ) {}

  async createSession(
    courseId: string,
    instructorId: string,
    startTime: Date
  ): Promise<LiveSessionDTO> {
    const roomId = `${courseId}-${Date.now()}`;
    const isLive = true;
    const session = await this._livesessionRepository.create({
      courseId,
      instructorId,
      startTime,
      roomId,
      isLive,
    });
    if (session) {
      const course = await this._courseRepository.findCourseById(courseId);

      if (course?.enrolledStudents?.length) {
        for (const studentId of course.enrolledStudents) {
          sendNotificationToUser(
            studentId.toString(),
            `📢 New live session scheduled for your course: "${course.title}".`
          );
        }
      }
    }

    if(!session){
      throw new Error("no such sessions")
    }

    return toLivesessionDTO(session);
  }

  async generateToken(
    sessionId: string,
    userId: string,
    role: "user" | "instructor"
  ): Promise<{
    token: string;
    appId: string | undefined;
    roomId: string;
    userId: string;
    courseId:string
  }> {
    const session = await this._livesessionRepository.findById(sessionId);
    if (!session) throw new Error("Session not found");

    const courseId=session.courseId.toString()

    const { token, appId, roomId } = await generateAgoraToken(
      session.roomId,
      userId,
      role
    );

    return { token, appId, roomId, userId, courseId };
  }

  async getLiveSessionByCourseId(
    courseId: string
  ): Promise<LiveSessionDTO> {
    const session =
      await this._livesessionRepository.findActiveByCourseId(courseId);
      if(!session){
        throw new Error("No live here")
      }
    return toLivesessionDTO(session);
  }

  async endSession(isLive: boolean, sessionId: string): Promise<LiveSessionDTO> {
    const session=await this._livesessionRepository.findById(sessionId)
    if(!session){
      throw new Error("No Session here")
    }
    const updated=await this._livesessionRepository.endSession(isLive,sessionId)
    if(!updated){
      throw new Error("no live here")
    }
    return toLivesessionDTO(updated)
  }
}
