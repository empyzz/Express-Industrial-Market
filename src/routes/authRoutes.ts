import { Router } from "express";
import * as authController from "../controllers/authController";
import { validateRegister, validateLogin, isAuthenticated, isGuest } from "../middleware/authMiddleware";

const router = Router();

// register 
router.get("/register", isGuest, authController.getRegister);
router.post("/register", isGuest, validateRegister, authController.PostRegister);

// login 
router.get("/login", isGuest, authController.GetLogin);
router.post("/login", isGuest, validateLogin, authController.PostLogin);

// logout
router.get("/logout", authController.GetLogout);

// Complete Company Profile
router.get("/complete-profile", isAuthenticated, authController.getCompleteProfile);
router.post("/complete-profile", isAuthenticated, authController.postCompleteProfile);

// Forgot Pass | Reset Password
router.get("/forgot-password", isGuest, authController.getForgotPasswordForm);
router.post("/forgot-password", isGuest, authController.handleForgotPassword);
router.get("/reset-password/:token", isGuest, authController.getResetPasswordForm);
router.post("/reset-password/:token", isGuest, authController.handleResetPassword);

export default router;
