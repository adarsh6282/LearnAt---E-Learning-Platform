import { generateAgoraToken } from "../../utils/generateAgoraToken";
import { ILiveSessionRepository } from "../../repository/interfaces/livesession.interface";
import { ILiveSession } from "../../models/interfaces/livesession.interface";
import { sendNotificationToUser } from "../../socket/socket";
import { ICourseRepository } from "../../repository/interfaces/course.interface";

export class LiveSessionService {
  constructor(
    private _livesessionRepository: ILiveSessionRepository,
    private _courseRepository: ICourseRepository
  ) {}

  async createSession(
    courseId: string,
    instructorId: string,
    startTime: Date
  ): Promise<ILiveSession | null> {
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

    return session;
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
  }> {
    const session = await this._livesessionRepository.findById(sessionId);
    if (!session) throw new Error("Session not found");

    const { token, appId, roomId } = await generateAgoraToken(
      session.roomId,
      userId,
      role
    );

    return { token, appId, roomId, userId };
  }

  async getLiveSessionByCourseId(
    courseId: string
  ): Promise<ILiveSession | null> {
    const session =
      await this._livesessionRepository.findActiveByCourseId(courseId);
    return session;
  }
}
