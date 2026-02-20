import { Router } from "express"
import { loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";



const router = Router();

/* POST /api/v1/auth/register */
router.route("/register").post(registerUser)

/* POST /api/v1/auth/login */
router.route("/login").post(loginUser)

/**
 * - POST /api/v1/auth/logout
 */

router.route("/logout").post(logoutUser)

export default router;