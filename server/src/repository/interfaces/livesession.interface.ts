import { ILiveSession } from "../../models/interfaces/livesession.interface";

export interface ILiveSessionRepository{
    create(data: any):Promise<ILiveSession|null>
    findById(id:string):Promise<ILiveSession|null>
    findActiveByCourseId(courseId: string): Promise<ILiveSession | null>
}