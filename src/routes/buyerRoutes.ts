import { Router } from "express";
import { isAuthenticated, isBuyer } from "../middleware/authMiddleware";
import * as buyerController from "../controllers/buyerController";
import * as cartController from "../controllers/cartController";


const router = Router();

router.use(isAuthenticated);
router.use(isBuyer);        

router.get("/dashboard", buyerController.getDashboard);

router.get("/profile", buyerController.getProfilePage);
router.post("/profile", buyerController.updateProfile);
router.get("/orders", buyerController.getOrders);

router.post("/cart/items", cartController.addOrUpdateCartItem);
router.get("/cart", cartController.getCart);
router.delete("/cart/:id", cartController.removeCartItem)


router.get("/quotation/send", cartController.getQuotationSendPage);
router.post("/quotation/send", cartController.createOrdersFromCart);


//router.get("/addresses/new", buyerController.getNewAddressForm);
//router.post("/addresses", buyerController.createAddress);
//router.get("/addresses/:id/edit", buyerController.getEditAddressForm);
//router.put("/addresses/:id", buyerController.updateAddress);
//router.delete("/addresses/:id", buyerController.deleteAddress);

export default router;
