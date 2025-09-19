"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toWalletDTO = exports.toTransactionDTO = void 0;
const toTransactionDTO = (transaction) => {
    return {
        amount: transaction.amount,
        type: transaction.type,
        courseTitle: transaction.courseTitle,
        description: transaction.description,
        createdAt: transaction.createdAt
    };
};
exports.toTransactionDTO = toTransactionDTO;
const toWalletDTO = (wallet) => {
    return {
        ownerType: wallet.ownerType || "unknown",
        ownerId: wallet.ownerId || "",
        balance: wallet.balance || 0,
        transactions: wallet.transactions?.map(exports.toTransactionDTO)
    };
};
exports.toWalletDTO = toWalletDTO;
