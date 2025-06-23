import { Types } from "mongoose";

export interface IWallet{
    ownerType:string,
    ownerId:Types.ObjectId,
    balance:number,
    transactions:[{
        amount:number,
        type:string,
        courseTitle:string,
        description:string,
        createdAt:Date
    }]
}