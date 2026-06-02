import { Router } from "express";
import { router as checkoutRouter } from "./checkout.routes.js";

export const router = Router()


router.use("/checkout",checkoutRouter)




