import { IWallet } from "../../models/interfaces/wallet.interface";
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

  findWalletOfInstructor(InstructorId: string): Promise<IWallet | null>;

  findWalletOfAdmin(): Promise<IWallet | null>;
}
