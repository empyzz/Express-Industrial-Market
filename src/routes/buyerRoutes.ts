import { Router } from "express";
import { isAuthenticated, isBuyer } from "../middleware/authMiddleware";
import * as buyerController from "../controllers/buyerController";
import * as cartController from "../controllers/cartController";
import * as reviewController from "../controllers/ReviewController"
import upload from "../config/multer";

const router = Router();

router.use(isAuthenticated);
router.use(isBuyer);        

router.get("/dashboard", buyerController.getDashboard);

router.get("/profile", buyerController.getProfilePage);
router.post("/profile", upload.single('avatar'), buyerController.updateProfile);

router.post("/cart/items", cartController.addOrUpdateCartItem);
router.get("/cart", cartController.getCart);
router.delete("/cart/:id", cartController.removeCartItem)

router.get("/quotation/send", cartController.getQuotationSendPage);
router.post("/quotation/send", cartController.createOrdersFromCart);

router.get("/orders/:orderId", buyerController.getOrderDetail);

router.get("/orders/:orderId/review", reviewController.getReviewChoicePage);
router.get("/order-item/:itemId/review", reviewController.getReviewForm);
router.post("/order-item/:itemId/review", reviewController.createReview);


export default router;
