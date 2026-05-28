import { Router } from "express";

export const router = Router();
import {
  createProduct,
  getProducts,
  getProduct,
} from "../modules/products/products.controller.js";

router.get("/:id", getProduct);
router.get("/", getProducts);
router.post("/", createProduct);
