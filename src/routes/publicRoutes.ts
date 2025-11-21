import { Router } from "express";
import * as indexController from "../controllers/publicController";
import { checkProfileOwnership } from "../middleware/profileMiddleware";

const router = Router()

router.get("/", indexController.getIndexPage);

router.get("/suppliers/:id", checkProfileOwnership, indexController.getSupplierProfile);
router.get("/search", indexController.handleSearch);

export default router;