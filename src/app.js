import express from "express"
import cookieParser from "cookie-parser"

const app = express()
//middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

//routes
import authRouter from "./routes/auth.routes.js"
import accountRouter from "./routes/account.routes.js"
import transactionRouter from "./routes/transaction.routes.js"

/**
 * Welcome Route - Home endpoint
 */
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Welcome to LedgerFlow API",
        version: "1.0.0",
        description: "A modern financial transaction management system",
        status: "Running",
        availableRoutes: {
            auth: "/api/v1/auth",
            account: "/api/v1/account",
            transaction: "/api/v1/transaction"
        },
        documentation: "Check the README.md for full API documentation"
    })
})

/**
 * Use Routes
 */
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/account",accountRouter)
app.use("/api/v1/transaction", transactionRouter)

export { app }