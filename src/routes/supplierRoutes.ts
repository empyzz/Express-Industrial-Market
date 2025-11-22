import { Router } from "express";
import { isSupplier, hasCompany } from "../middleware/authMiddleware";
import * as supplierController from "../controllers/supplierController";
import * as productController from "../controllers/productController";
import { validateProduct } from "../middleware/productMiddleware";
import upload from "../config/multer";

const router = Router();

router.use(isSupplier);
router.use(hasCompany);

router.get("/dashboard", hasCompany, isSupplier ,supplierController.getDashboard);

// --- GERENCIAMENTO DE PRODUTOS ---
// (Exemplos de como seriam as rotas de produtos)

// GET /supplier/products
router.get("/products", productController.GetProduts);

// GET / POST /supplier/products/new
router.get("/products/new", productController.getCreateProdutc);
router.post("/products", validateProduct, productController.createProduct);

// GET/PUT /products
router.get("/products/:id/edit", productController.getEditProductForm);
router.put(
    "/products/:id",
    upload.fields([
        { name: 'images', maxCount: 5 }, 
        { name: 'manual', maxCount: 1 }
    ]),
    validateProduct,
    productController.updateProduct
);

// DELETE /products
router.delete("/products/:id", productController.deleteProduct);

// Profile
router.get("/profile/edit", supplierController.getEditProfileForm);

router.put(
    "/profile",
    upload.fields([
        { name: 'logo', maxCount: 1 },
        { name: 'banner', maxCount: 1 }
    ]),
    supplierController.updateProfile
);

router.get("/orders/:orderId", supplierController.getOrderDetail);


router.post("/orders/:orderId/confirm", supplierController.confirmOrder);
router.post("/orders/:orderId/cancel", supplierController.cancelOrder);
router.post("/orders/:orderId/ship", supplierController.shipOrder);
router.post("/orders/:orderId/deliver", supplierController.deliveredOrder);

export default router;      
