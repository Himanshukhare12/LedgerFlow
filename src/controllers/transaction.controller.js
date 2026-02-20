import mongoose from "mongoose";
import { Account } from "../models/account.model.js";
import { Transaction } from "../models/transaction.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Ledger } from "../models/ledger.model.js";
import { sendTransactionEmail } from "../utils/Nodemailer.js";

/**
 * The 10-step transferflow :
     * 1. Validate request body
     * 2. Validate idempotency key
     * 3. Check account status
     * 4. Derive sender balance from ledger
     * 5. Create transaction with PENDING status
     * 6. Create DEBIT ledger entry for sender
     * 7. Create CREDIT ledger entry for receiver
     * 8. Mark transaction as COMPLETED
     * 9. Commit MongoDB session
     * 10. Send email notification to both sender and receiver
 */

export const createTransaction = asyncHandler(async(req, res) =>{

    /**
     * validate request body
     */
    const { fromAccount, toAccount, amount, idempotencyKey } = req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey)
    throw new ApiError(400, "All fields are required for creating a transaction !!")

    const fromUserAccount = await Account.findOne({
        _id: fromAccount
    })
    const toUserAccount = await Account.findOne({
        _id: toAccount
    })
    if(!fromUserAccount || !toUserAccount)
    throw new ApiError(404, "Both source and destination accounts must exist !!")

    /**
     * Validate idempotency key
     */

    const isTransctionAlreadyExists = await Transaction.findOne({
        idempotencyKey
    })
    if(isTransctionAlreadyExists){
        if(isTransctionAlreadyExists.status === "COMPLETED"){
            return res.status(200).json(new ApiResponse(200, isTransctionAlreadyExists, "Transaction already Processed with this idempotencyKey !!"))
        }
        if(isTransctionAlreadyExists.status === "PENDING"){
            return res.status(200).json(new ApiResponse(200, isTransctionAlreadyExists, "Transaction is still being processed !!"))
        }
        if(isTransctionAlreadyExists.status === "FAILED"){
            throw new ApiError(500, "Transaction processing failed, please try again !!")
        }
        if(isTransctionAlreadyExists.status === "REVERSED"){
            throw new ApiError(500, "Transaction has been reversed, please try again !!")
        }
    }

    /**
     * check account status
     */
    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE")
    throw new ApiError(400, "Both fromAccount and  toAccount must be ACTIVE to process transaction !!")

    /**
     * Derive sender balance from ledger
     */

    const balance = await fromUserAccount.getBalance()

    if(balance < amount)
    throw new ApiError(400, `Insufficient balance. Current balance is ${balance} amount is ${amount} !!`)

    /**
     * Create transaction with PENDING status
     */
    let transaction
    let session
    try {
    session = await mongoose.startSession()
    session.startTransaction()
    transaction = (await Transaction.create([{
                fromAccount,
                toAccount,
                amount,
                idempotencyKey,
                status: "PENDING"
        }], {session}))[0]
    
        /**
         * Create DEBIT ledger entry for sender
         */
    
        const debitLedgerEntry = await Ledger.create([{
                account: fromAccount,
                amount: amount,
                type: "DEBIT",
                transaction: transaction._id
        }], {session})
    
        await (() => {
            return new Promise((resolve) => setTimeout(resolve, 15 * 1000));
        })()
    
        /**
         * Create CREDIT ledger entry for receiver
         */

        const creditLedgerEntry = await Ledger.create([{
                account: toAccount,
                amount: amount,
                type: "CREDIT",
                transaction: transaction._id
        }], {session})
    
        /**
         * Mark transaction as COMPLETED
         */
    
        transaction= await Transaction.findByIdAndUpdate(transaction._id, {
            status: "COMPLETED"
        }, {new: true, session})
    
        /**
         * Commit MongoDB session
         */
        await session.commitTransaction()
        session.endSession()
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw new ApiError(400, "Transaction is Pending due to some issues, please retry after sometime !!")
    }

    /**
     * Send email notification to both sender and receiver
     */

    await sendTransactionEmail(req.user.email, req.user.name, amount, toUserAccount._id, transaction._id)

    return res.status(201).json(new ApiResponse(201, transaction, "Transaction completed successfully !!"))
})

export const createInitialFunds = asyncHandler(async(req,res)=>{
    const { toAccount, amount, idempotencyKey } = req.body

    if(!toAccount || !amount || !idempotencyKey)
    throw new ApiError(400, "All fields are required for creating a transaction !!")

    const toUserAccount = await Account.findOne({
        _id: toAccount
    })

    if(!toUserAccount)
    throw new ApiError(404, "Destination account does not exist !!")

    const fromUserAccount = await Account.findOne({
        user: req.user._id,
    })
    if(!fromUserAccount)
    throw new ApiError(404, "sender account does not exist !!")

    const session = await mongoose.startSession()
    session.startTransaction()

    try {
        const transaction = new Transaction({
            fromAccount: fromUserAccount._id,
            toAccount,
            amount,
            idempotencyKey,
            status: "PENDING"
        })

        const debitLedgerEntry = await Ledger.create([{
            account: fromUserAccount._id,
            amount: amount,
            type: "DEBIT",
            transaction: transaction._id
        }], {session})

        const creditLedgerEntry = await Ledger.create([{
            account: toAccount,
            amount: amount,
            type: "CREDIT",
            transaction: transaction._id
        }], {session})

        transaction.status = "COMPLETED"
        await transaction.save({session})

        await session.commitTransaction()
        session.endSession()

        return res.status(201).json(new ApiResponse(201, transaction, "Initial funds transaction completed successfully !!"))
    } catch (error) {
        await session.abortTransaction()
        session.endSession()
        throw new ApiError(400, error?.message || "Initial funds transaction failed !!")
    }
})