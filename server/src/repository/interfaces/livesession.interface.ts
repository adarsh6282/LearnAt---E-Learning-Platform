import { ILiveSession } from "../../models/interfaces/livesession.interface";

export interface ILiveSessionRepository{
    create(data: Partial<ILiveSession>):Promise<ILiveSession|null>
    findById(id:string):Promise<ILiveSession|null>
    findActiveByCourseId(courseId: string): Promise<ILiveSession | null>
    endSession(isLive:boolean,sessionId:string):Promise<ILiveSession|null>
}