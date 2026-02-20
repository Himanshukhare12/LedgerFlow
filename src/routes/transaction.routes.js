import { Router } from "express";
import { verifyJWT, verifySystemUser } from "../middlewares/auth.middleware.js";
import { createInitialFunds, createTransaction } from "../controllers/transaction.controller.js";


const router = Router();

/**
 * - Post /api/v1/transaction
 * - Create a new transaction
 * - Protected Route - Only authenticated users can create a transaction
 */

router.route("/").post(verifyJWT, createTransaction)

/**
 * Post /api/v1/transaction/system/initial-funds
 * - Create initial funds for a user (System User)
 */

router.route("/system/initial-funds").post(verifySystemUser, createInitialFunds)

export default router;