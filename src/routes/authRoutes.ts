import { Router } from "express";
import * as authController from "../controllers/authController";
import { validateRegister, validateLogin,} from "../middleware/authMiddleware";

const router = Router();

// register 
router.get("/register", authController.register);
router.post("/register", validateRegister, authController.register);

//login 
router.get("/login", authController.login);
router.post("/login", validateLogin, authController.login);

export default router;
