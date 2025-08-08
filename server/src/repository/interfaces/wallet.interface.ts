import { ITransaction, IWallet } from "../../models/interfaces/wallet.interface";
import { Types } from "mongoose";

export interface IWalletRepository {
  creditWallet({
    ownerType,
    ownerId,
    amount,
    courseId,
    description,
  }: {
    ownerType: "instructors" | "admin";
    ownerId?: string | Types.ObjectId;
    amount: number;
    courseId: string;
    description: string;
  }): Promise<IWallet | null>;

  findWalletOfInstructor(InstructorId: string,page:number,limit:number): Promise<{wallet:Partial<IWallet>,total:number,totalPages:number,transactions:ITransaction[]}>

  findWalletOfAdmin(page:number,limit:number): Promise<{ wallet: Partial<IWallet>; total: number; totalPages: number,transactions:ITransaction[] }>;

  getIncomeStats():Promise<{month:string,revenue:number}[]>
  getIncome(instructorId:string):Promise<{month:string,revenue:number}[]>
}
