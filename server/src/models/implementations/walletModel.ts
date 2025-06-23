import mongoose, { Schema } from "mongoose";
import { IWallet } from "../interfaces/wallet.interface";

const walletSchema: Schema<IWallet> = new Schema(
  {
    ownerType: {
      type: String,
      enum: ["instructors", "admin"],
      required: true,
    },
    ownerId: {
      type: Schema.Types.ObjectId,
      required: true,
      refPath: "ownerType",
    },
    balance: {
      type: Number,
      required: true,
      default: 0,
    },
    transactions: [
      {
        amount: {
          type: Number,
        },
        type: {
          type: String,
          default: "credit",
        },
        description: { type: String },
        courseTitle:{type:String},
        createdAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model<IWallet>("Wallet", walletSchema);
