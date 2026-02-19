import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createAccount } from "../controllers/account.controller.js";



const router = Router();

/**
 * - Post /api/v1/account
 * - Create a new account
 * - Protected Route - Only authenticated users can create an account
 */
router.route("/").post(verifyJWT, createAccount)

export default router;