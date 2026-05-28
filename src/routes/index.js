import { Router } from "express";
import { router as productsRouter } from "./products.routes.js";
import { router as categoriesRouter } from "./categories.routes.js";

export const router = Router();
router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
