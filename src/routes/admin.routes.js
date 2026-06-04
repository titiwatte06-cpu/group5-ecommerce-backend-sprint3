import { Router } from "express";
import { authUser, adminOnly } from "../middleware/authUser.js";
import { getAdminStats, getAdminOrders } from "../modules/admin/admin.controller.js";

export const router = Router();

router.get("/stats", authUser, adminOnly, getAdminStats);
router.get("/orders", authUser, adminOnly, getAdminOrders);
