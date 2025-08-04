import { IWallet } from "../../models/interfaces/wallet.interface";
import { IWalletRepository } from "../interfaces/wallet.interface";
import Wallet from "../../models/implementations/walletModel";
import mongoose, { Types } from "mongoose";
import { ITransaction } from "../../models/interfaces/wallet.interface";

export class WalletRepository implements IWalletRepository {
  async creditWallet({
    ownerType,
    ownerId,
    amount,
    courseId,
    description,
  }: {
    ownerType: "instructors" | "admin";
    ownerId: string | Types.ObjectId;
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

  async findWalletOfInstructor(InstructorId: string): Promise<IWallet | null> {
    return await Wallet.findOne({ ownerId: InstructorId });
  }

  async findWalletOfAdmin(
    page: number,
    limit: number
  ): Promise<{
    wallet: Partial<IWallet>;
    transactions: ITransaction[];
    total: number;
    totalPages: number;
  }> {
    const skip = (page - 1) * limit;

    const wallet = await Wallet.findOne({ ownerType: "admin" })
      .select("balance transactions")
      .lean();

    const allTransactions = wallet?.transactions || [];

    const total = allTransactions.length;
    const totalPages = Math.ceil(total / limit);

    const paginatedTransactions = allTransactions
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(skip, skip + limit);

    return {
      wallet: { balance: wallet?.balance || 0 },
      transactions: paginatedTransactions,
      total,
      totalPages,
    };
  }

  async getIncomeStats(): Promise<{ month: string; revenue: number }[]> {
    const results = await Wallet.aggregate([
      { $match: { ownerType: "admin" } },
      { $unwind: "$transactions" },
      {
        $group: {
          _id: {
            year: { $year: "$transactions.createdAt" },
            month: { $month: "$transactions.createdAt" },
          },
          totalRevenue: { $sum: "$transactions.amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  "$_id.month",
                ],
              },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          revenue: { $toDouble: "$totalRevenue" },
        },
      },
    ]);

    return results.map((item) => ({
      month: item.month,
      revenue: Number(item.revenue),
    }));
  }

  async getIncome(instructorId: string): Promise<{month:string,revenue:number}[]> {
    const results = await Wallet.aggregate([
      {
        $match: {
          ownerType: "instructors",
          ownerId: new mongoose.Types.ObjectId(instructorId),
        },
      },
      { $unwind: "$transactions" },
      {
        $group: {
          _id: {
            year: { $year: "$transactions.createdAt" },
            month: { $month: "$transactions.createdAt" },
          },
          totalRevenue: { $sum: "$transactions.amount" },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      {
        $project: {
          _id: 0,
          month: {
            $concat: [
              {
                $arrayElemAt: [
                  [
                    "",
                    "Jan",
                    "Feb",
                    "Mar",
                    "Apr",
                    "May",
                    "Jun",
                    "Jul",
                    "Aug",
                    "Sep",
                    "Oct",
                    "Nov",
                    "Dec",
                  ],
                  "$_id.month",
                ],
              },
              " ",
              { $toString: "$_id.year" },
            ],
          },
          revenue: { $toDouble: "$totalRevenue" },
        },
      },
    ]);

    return results.map((item) => ({
      month: item.month,
      revenue: Number(item.revenue),
    }));
  }
}
