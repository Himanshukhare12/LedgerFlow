import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"

const userSchema = new Schema({
    email: {
        type: String,
        required: [true, "Email is required for creating a user account !!"],
        lowercase: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/ , "Please enter a valid email address !!"],
        unique: [true, "Email already exists !!"]
    },
    name: {
        type: String,
        required: [true, "Name is required for creating a user account !!"],
    },
    password: {
        type: String,
        required: [true, "Password is required for creating a user account !!"],
        minlength: [6, "Password must be at least 6 characters long !!"],
        select: false
    },
    systemUser: {
        type: Boolean,
        default: false,
        immutable: true,
        select: false
    }
}, {timestamps: true})

userSchema.pre("save", async function(next) {
    if(!this.isModified("password"))
    return;
    this.password = await bcrypt.hash(this.password, 10)
})

userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function() {
    return jwt.sign(
        {
            _id: this._id,
            email: this.email,
            name: this.name
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
    )
}

export const User = mongoose.model("User", userSchema)
