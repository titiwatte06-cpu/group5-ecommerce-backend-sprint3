import { Router } from "express";
import { authUser, adminOnly } from "../middleware/authUser.js";
import {
  getProducts,
  getProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../modules/products/product.controller.js";

export const router = Router();

router.get("/", getProducts);
router.get("/:id", getProduct);
router.post("/", authUser, adminOnly, createProduct);
router.put("/:id", authUser, adminOnly, updateProduct);
router.delete("/:id", authUser, adminOnly, deleteProduct);
