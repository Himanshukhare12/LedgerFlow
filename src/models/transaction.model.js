import mongoose, { Schema } from "mongoose";


const transactionSchema = new Schema({

    fromAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction must have a source account !!"],
        index: true
    },
    toAccount: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Transaction must have a destination account !!"],
        index: true
    },
    status: {
        type: String,
        enum: {
            values: ["PENDING", "COMPLETED", "FAILED","REVERSED"],
            message: "Status must be either PENDING, COMPLETED, FAILED or REVERSED !!"
        },
        default: "PENDING"
    },
    amount: {
        type: Number,
        required: [true, "Amount is required for creating a transaction !!"],
        min: [0.01, "Amount must be at least 0.01 !!"]
    },
    idempotencyKey: {
        type: String,
        required: [true, "Idempotency Key is required for creating a transaction !!"],
        unique: true,
        index: true
    }
}, {timestamps: true})

export const Transaction = mongoose.model("Transaction", transactionSchema)