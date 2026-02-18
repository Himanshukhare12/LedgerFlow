import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { sendRegistrationEmail } from "../utils/Nodemailer.js"

const generateAccessTokens = async(userId) => {
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        return { accessToken };
    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
}


const registerUser = asyncHandler(async (req, res)=>{

    const {email, name, password} = req.body

    if([email, name, password].some((field)=> field?.trim() === ""))
    throw new ApiError(400, "All fields are required and must not be empty !!")

    const existingUser = await User.findOne({email})
    if(existingUser)
    throw new ApiError(409, "Email already exists !!")

    const user = await User.create({
        email,
        name,
        password
    })

    const createdUser = await User.findById(user._id)
    if(!createdUser)
    throw new ApiError(500, "Something went wrong while registering the user !!")

    res.status(201).json(new ApiResponse(201, createdUser, "User registered successfully !!"))
    await sendRegistrationEmail(email, name)
})

const loginUser = asyncHandler(async(req, res) => {
    const {email, password} = req.body

    if(email?.trim() === "" || password?.trim() === "")
    throw new ApiError(400, "Email and password are required and must not be empty !!")

    const user = await User.findOne({email}).select("+password")
    if(!user)
    throw new ApiError(401, "Invalid email or password !!")

    const isPasswordValid = await user.isPasswordCorrect(password)
    if(!isPasswordValid)
    throw new ApiError(401, "Invalid credentials !!")

    const { accessToken } = await generateAccessTokens(user._id)

    const options = {
        httpOnly: true,
        secure: true
    }
    const loggedInUser = await User.findById(user._id)
    res.status(200)
    .cookie("accessToken", accessToken, options)
    .json(
        new ApiResponse(200, loggedInUser, "User logged in successfully !!")
    )
})

export { registerUser, loginUser }