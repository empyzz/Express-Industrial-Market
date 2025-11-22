import { Router } from "express";
import * as indexController from "../controllers/publicController";
import { checkProfileOwnership } from "../middleware/profileMiddleware";

const router = Router()

// Landing page
router.get("/", indexController.getIndexPage);

// Get supplier profile page
router.get("/suppliers/:id", checkProfileOwnership, indexController.getSupplierProfile);

// Search bar
router.get("/search", indexController.handleSearch);

export default router;