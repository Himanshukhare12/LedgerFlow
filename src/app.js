import express from "express"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import accountRouter from "./routes/account.routes.js"
import transactionRouter from "./routes/transaction.routes.js"

const app = express()
//middlewares
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

/**
 * Welcome Route - Home endpoint
 */
app.get("/", (req, res) => {
    try {
        return res.send({
            success: true,
            message: "Welcome to LedgerFlow API",
            version: "1.0.0",
            description: "A modern financial transaction management system",
            status: "Running",
            availableRoutes: {
                auth: "/api/v1/auth",
                account: "/api/v1/account",
                transaction: "/api/v1/transaction"
            },
            documentation: "Check the README.md for full API documentation",
            timestamp: new Date().toISOString()
        })
    } catch (error) {
        res.status(500).send({
            success: false,
            message: "Internal server error",
            error: error.message
        })
    }
})

/**
 * Use Routes
 */
app.use("/api/v1/auth",authRouter)
app.use("/api/v1/account",accountRouter)
app.use("/api/v1/transaction", transactionRouter)

export { app }