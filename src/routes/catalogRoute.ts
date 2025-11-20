import { Router } from "express";
import * as catalogController from "../controllers/catalogController";

const router = Router();


// GET /catalog
router.get("/", catalogController.getCatalog);

export default router;
