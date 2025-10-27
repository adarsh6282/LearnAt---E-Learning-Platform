"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LiveSessionService = void 0;
const generateAgoraToken_1 = require("../../utils/generateAgoraToken");
const socket_1 = require("../../socket/socket");
class LiveSessionService {
    constructor(_livesessionRepository, _courseRepository) {
        this._livesessionRepository = _livesessionRepository;
        this._courseRepository = _courseRepository;
    }
    async createSession(courseId, instructorId, startTime) {
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
                    (0, socket_1.sendNotificationToUser)(studentId.toString(), `📢 New live session scheduled for your course: "${course.title}".`);
                }
            }
        }
        return session;
    }
    async generateToken(sessionId, userId, role) {
        const session = await this._livesessionRepository.findById(sessionId);
        if (!session)
            throw new Error("Session not found");
        const { token, appId, roomId } = await (0, generateAgoraToken_1.generateAgoraToken)(session.roomId, userId, role);
        return { token, appId, roomId, userId };
    }
    async getLiveSessionByCourseId(courseId) {
        const session = await this._livesessionRepository.findActiveByCourseId(courseId);
        return session;
    }
}
exports.LiveSessionService = LiveSessionService;
