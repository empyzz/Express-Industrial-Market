import { Router } from "express";
import * as authController from "../controllers/authController";
import {   
    validateRegister, 
    validateLogin, 
    isAuthenticated, 
    isGuest
} from "../middleware/authMiddleware";

const router = Router();

// register 
router.get("/register", isGuest, authController.getRegister);
router.post("/register", isGuest, validateRegister, authController.PostRegister);

//login 
router.get("/login", isGuest, authController.GetLogin);
router.post("/login", isGuest, validateLogin, authController.PostLogin);

router.get("/logout", authController.GetLogout);

router.get("/complete-profile", isAuthenticated, authController.getCompleteProfile);
router.post("/complete-profile", isAuthenticated, authController.postCompleteProfile);

export default router;
