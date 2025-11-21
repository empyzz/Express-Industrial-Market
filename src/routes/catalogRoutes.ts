import { Router } from "express";
import * as catalogController from "../controllers/catalogController";

const router = Router();


// GET /catalog
router.get("/", catalogController.getCatalog);

// GET /catalog/{product_id}
router.get("/products/:id", catalogController.getProductById);


export default router;
