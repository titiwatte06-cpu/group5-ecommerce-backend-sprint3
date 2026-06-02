import { Router } from "express";
import { router as productsRouter } from "./products.routes.js";
import { router as categoriesRouter } from "./categories.routes.js";
import { router as userRouter } from "./user.routes.js";
import { router as orderRouter} from "./order.routes.js"

export const router = Router();

router.use("/products", productsRouter);
router.use("/categories", categoriesRouter);
router.use("/users", userRouter);
router.use("/orders",orderRouter);
