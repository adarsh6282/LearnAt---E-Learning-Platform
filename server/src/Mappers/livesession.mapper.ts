import { LiveSessionDTO } from "../DTO/livesession.dto";
import { ILiveSession } from "../models/interfaces/livesession.interface";

export const toLivesessionDTO=(ls:ILiveSession):LiveSessionDTO=>{
    return {
        _id:ls._id?.toString(),
        isLive:ls.isLive
    }
}