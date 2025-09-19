import { TransactionDTO, WalletDTO } from "../DTO/wallet.dto"
import { ITransaction, IWallet } from "../models/interfaces/wallet.interface"

export const toTransactionDTO=(transaction:ITransaction):TransactionDTO=>{
    return {
        amount:transaction.amount,
        type:transaction.type,
        courseTitle:transaction.courseTitle,
        description:transaction.description,
        createdAt:transaction.createdAt
    }
}

export const toWalletDTO=(wallet:IWallet):WalletDTO=>{
    return{
        ownerType:wallet.ownerType||"unknown",
        ownerId:wallet.ownerId||"",
        balance:wallet.balance||0,
        transactions:wallet.transactions?.map(toTransactionDTO)
    }
}