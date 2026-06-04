import { Router } from "express";
import { authUser } from "../middleware/authUser.js";
import { createOrder } from "../modules/order/order.controller.js";

export const router = Router();

router.post("/", authUser, createOrder);
