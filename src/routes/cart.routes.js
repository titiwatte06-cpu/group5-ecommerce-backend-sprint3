import { Router } from "express";

import { authUser } from "../middleware/authUser.js";

export const router = Router();

import {
  addToCart,
  getCart,
  clearCart,
  editCartItem,
} from "../modules/carts/cart.controller.js";

router.post("/", authUser, addToCart);
router.get("/", authUser, getCart);
router.put("/", authUser, editCartItem);
router.delete("/", authUser, clearCart);
