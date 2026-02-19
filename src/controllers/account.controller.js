import { Account } from "../models/account.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const createAccount = async (req, res) => {

    const user = req.user
    const account = await Account.create({
        user: user._id
    })

    res.status(201).json(new ApiResponse(201, account, "Account created successfully !!"))
}

export { createAccount }
