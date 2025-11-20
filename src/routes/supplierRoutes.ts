import { Router } from "express";
import { isSupplier, hasCompany } from "../middleware/authMiddleware";
import * as supplierController from "../controllers/supplierController";
import * as productController from "../controllers/productController";
import { validateProduct } from "../middleware/productMiddleware";

const router = Router();

router.use(isSupplier, hasCompany);

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
router.put("/products/:id", validateProduct, productController.updateProduct);

// DELETE /products
router.delete("/products/:id", productController.deleteProduct);

export default router;
