import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createTransaction } from "../controllers/transaction.controller.js";


const router = Router();

/**
 * - Post /api/v1/transaction
 * - Create a new transaction
 * - Protected Route - Only authenticated users can create a transaction
 */

router.route("/").post(verifyJWT, createTransaction)

export default router;