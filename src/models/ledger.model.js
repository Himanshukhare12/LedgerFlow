import mongoose, { Schema } from "mongoose";
import { ApiError } from "../utils/ApiError.js";


const ledgerSchema = new Schema({
    account: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Account",
        required: [true, "Ledger entry must be associated with an account !!"],
        index: true,
        immutable: true
    },
    amount: {
        type: Number,
        required: [true, "Amount is required for creating a ledger entry !!"],
        immutable: true
    },
    transaction: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Transaction",
        required: [true, "Ledger entry must be associated with a transaction !!"],
        index: true,
        immutable: true
    },
    type: {
        type: String,
        enum: {
            values: ["DEBIT", "CREDIT"],
            message: "Type must be either DEBIT or CREDIT !!"
        },
        required: [true, "Type is required for creating a ledger entry !!"],
        immutable: true
    }
})

function preventLedgerModification(){
    throw new ApiError(400, "Ledger entries cannot be modified or deleted !!")
}

ledgerSchema.pre("findOneAndUpdate", preventLedgerModification)
ledgerSchema.pre("findOneAndDelete", preventLedgerModification)
ledgerSchema.pre("findOneAndReplace", preventLedgerModification)
ledgerSchema.pre("updateOne", preventLedgerModification)
ledgerSchema.pre("deleteOne", preventLedgerModification)
ledgerSchema.pre("deleteMany", preventLedgerModification)
ledgerSchema.pre("updateMany", preventLedgerModification)
ledgerSchema.pre("replaceOne", preventLedgerModification)
ledgerSchema.pre("update", preventLedgerModification)
ledgerSchema.pre("remove", preventLedgerModification)


export const Ledger = mongoose.model("Ledger", ledgerSchema)