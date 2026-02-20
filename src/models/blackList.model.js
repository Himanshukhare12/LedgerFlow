import mongoose, { Schema } from "mongoose";


const tokenBlacklistSchema = new Schema({
    token: {
        type: String,
        required: [true, "Token is required for blacklisting !!"],
        unique: [true, "Token is already blacklisted !!"]
    }
}, {timestamps: true})


tokenBlacklistSchema.index({ createdAt: 1 }, {
    expireAfterSeconds: 60 * 60 * 24 * 3 // 3 days
})

export const TokenBlacklist = mongoose.model("TokenBlacklist", tokenBlacklistSchema)