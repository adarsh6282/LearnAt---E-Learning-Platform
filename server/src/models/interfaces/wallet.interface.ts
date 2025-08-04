import { Types } from "mongoose";

export interface ITransaction {
  amount: number;
  type: "credit" | "debit";
  courseTitle: string;
  description: string;
  createdAt: Date;
}

export interface IWallet{
    ownerType:string,
    ownerId:Types.ObjectId,
    balance:number,
    transactions:ITransaction[]
}