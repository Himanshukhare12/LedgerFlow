import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createAccount, getAccountBalance, getUserAccounts } from "../controllers/account.controller.js";



const router = Router();

/**
 * - Post /api/v1/account
 * - Create a new account
 * - Protected Route - Only authenticated users can create an account
 */
router.route("/").post(verifyJWT, createAccount)

/**
 * - Get /api/v1/account
 * - Get all accounts of the authenticated user
 * - Protected Route - Only authenticated users can get their accounts
 */
router.route("/").get(verifyJWT, getUserAccounts)

/**
 * - Get /api/v1/account/balance/:accountId
 * - Get the balance of a specific account
 * - Protected Route - Only authenticated users can get their account balance
 */
router.route("/balance/:accountId").get(verifyJWT, getAccountBalance)

export default router;