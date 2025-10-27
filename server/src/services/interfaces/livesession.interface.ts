import { ILiveSession } from "../../models/interfaces/livesession.interface";

export interface ILiveSessionService{
    createSession(courseId: string, instructorId: string, startTime: Date):Promise<ILiveSession|null>
    generateToken(sessionId: string, userId: string, role: "user"|"instructor"):Promise<{ token: string; appId: string|undefined; roomId: string,userId:string }>
    getLiveSessionByCourseId(courseId: string): Promise<ILiveSession | null>
}