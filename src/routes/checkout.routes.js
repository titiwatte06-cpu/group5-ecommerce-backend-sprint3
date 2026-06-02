
import { Router } from "express";
import { checkOut } from "../modules/checkout/checkout.controller.js";
import { authUser } from "../middleware/authUser.js";

export const router = Router();




router.post("/",authUser, checkOut)
