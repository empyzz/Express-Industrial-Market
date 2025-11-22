import { Router } from "express";
import { isSupplier, hasCompany } from "../middleware/authMiddleware";
import * as supplierController from "../controllers/supplierController";
import * as productController from "../controllers/productController";
import { validateCreateProduct, validateUpdateProduct } from "../middleware/productMiddleware";
import upload from "../config/multer";

const router = Router();

router.use(isSupplier);
router.use(hasCompany);

// Dashboard
router.get("/dashboard", hasCompany, isSupplier ,supplierController.getDashboard);

// Get all supplier products 
router.get("/products", productController.GetProduts);

// CRUD Products
router.get("/products/new", productController.getCreateProdutc);
router.post(
    "/products", 
    upload.fields([{ name: 'images', maxCount: 5 }, { name: 'manual', maxCount: 1 }]),
    validateCreateProduct,
    productController.createProduct
);

router.get("/products/:id/edit", productController.getEditProductForm);
router.put(
    "/products/:id", 
    upload.fields([{ name: 'images', maxCount: 5 }, { name: 'manual', maxCount: 1 }]),
    validateUpdateProduct,
    productController.updateProduct
);

router.delete("/products/:id", productController.deleteProduct);

// Edit Profile
router.get("/profile/edit", supplierController.getEditProfileForm);
router.put(
    "/profile",
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'banner', maxCount: 1 }
    ]),
    supplierController.updateProfile
);

// Control Order Status
router.get("/orders/:orderId", supplierController.getOrderDetail);
router.post("/orders/:orderId/confirm", supplierController.confirmOrder);
router.post("/orders/:orderId/cancel", supplierController.cancelOrder);
router.post("/orders/:orderId/ship", supplierController.shipOrder);
router.post("/orders/:orderId/deliver", supplierController.deliveredOrder);

// Get all the reviews for the supplier
router.get("/reviews", supplierController.getReviewsPage);

export default router;      
