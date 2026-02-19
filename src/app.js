import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//routes
import authRouter from "./routes/auth.routes.js"
import accountRouter from "./routes/account.routes.js"
import transactionRouter from "./routes/transaction.routes.js"
/**
 * Use Routes
 */
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/account",accountRouter)
app.use("/api/v1/transaction", transactionRouter)

export { app }