import { Router } from "express";

import { authUser } from "../middleware/authUser.js";

export const router = Router();

import { addToCart, getCart } from "../modules/carts/cart.controller.js";

router.post("/", authUser, addToCart);
router.get("/", authUser, getCart);
