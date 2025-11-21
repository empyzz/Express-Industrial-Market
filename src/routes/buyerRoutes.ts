import { Router } from "express";
import { isBuyer } from "../middleware/authMiddleware";
import * as buyerController from "../controllers/buyerController";

const router = Router();

router.use(isBuyer);

router.get("/dashboard", buyerController.getDashboard);

router.get("/profile", buyerController.getProfilePage);
router.post("/profile", buyerController.updateProfile);

//router.get("/addresses/new", buyerController.getNewAddressForm);
//router.post("/addresses", buyerController.createAddress);
//router.get("/addresses/:id/edit", buyerController.getEditAddressForm);
//router.put("/addresses/:id", buyerController.updateAddress);
//router.delete("/addresses/:id", buyerController.deleteAddress);

export default router;
