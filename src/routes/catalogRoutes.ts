import { Router } from "express";
import * as catalogController from "../controllers/catalogController";

const router = Router();


// Catalog Main Page
router.get("/", catalogController.getCatalog);

// Catalog Product Specific Page
router.get("/products/:id", catalogController.getProductById);

export default router;
