import { Account } from "../models/account.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


const createAccount = asyncHandler(async (req, res) => {

    const user = req.user
    const account = await Account.create({
        user: user._id
    })

    res.status(201).json(new ApiResponse(201, account, "Account created successfully !!"))
})

const getUserAccounts = asyncHandler(async (req, res) => {
    const accounts = await Account.find({
        user: req.user._id
    })

    res.status(200).json(new ApiResponse(200, accounts, "User accounts retrieved successfully !!"))
})

const getAccountBalance = asyncHandler(async (req, res) => {
    const accountId = req.params.accountId
    const account = await Account.findOne({
        _id: accountId,
        user: req.user._id
    })
    if(!account)
    throw new ApiError(404, "Account not found !!")

    const balance = await account.getBalance()

    res.status(200).json(new ApiResponse(200, { balance }, "Account balance retrieved successfully !!"))
})


export { createAccount, getUserAccounts, getAccountBalance }