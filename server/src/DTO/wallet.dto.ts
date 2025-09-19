import { Types } from "mongoose";

export interface TransactionDTO{
    amount:number,
    type:"credit"|"debit",
    courseTitle:string,
    description:string,
    createdAt:Date
}

export interface WalletDTO{
    ownerType:string
    ownerId?:string|Types.ObjectId,
    balance:number,
    transactions:TransactionDTO[],
}