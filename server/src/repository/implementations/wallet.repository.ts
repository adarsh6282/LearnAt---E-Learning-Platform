import { IWallet } from "../../models/interfaces/wallet.interface";
import { IWalletRepository } from "../interfaces/wallet.interface";
import Wallet from "../../models/implementations/walletModel";
import { Types } from "mongoose";

export class WalletRepository implements IWalletRepository {
  async creditWallet({
    ownerType,
    ownerId,
    amount,
    courseId,
    description,
  }: {
    ownerType: "instructors" | "admin";
    ownerId: string|Types.ObjectId;
    amount: number;
    courseId: string;
    description: string;
  }): Promise<IWallet | null> {
    const query =
      ownerType === "admin" ? { ownerType } : { ownerType, ownerId };
    return await Wallet.findOneAndUpdate(
      query,
      {
        $inc: { balance: amount },
        $push: {
          transactions: {
            type: "credit",
            amount,
            courseId,
            description,
          },
        },
      },
      { upsert: true, new: true }
    );
  }

  async findWalletOfInstructor(InstructorId:string):Promise<IWallet|null>{
    return await Wallet.findOne({ownerId:InstructorId})
  }

  async findWalletOfAdmin(): Promise<IWallet | null> {
    return await Wallet.findOne({ownerType:"admin"})
  }
}
