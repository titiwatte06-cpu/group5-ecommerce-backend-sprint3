import { Router } from "express";

import { authUser, adminOnly } from "../middleware/authUser.js";

export const router = Router();

import {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  userLogin,
  authenUser,
  userLogout,
  getUserAddresses,
  addUserAddress,
  updateUserAddress,
  deleteUserAddress,
} from "../modules/user/user.controller.js";

router.post("/login", userLogin);
router.post("/logout", userLogout);
router.get("/profile", authUser, authenUser);
router.get("/me/addresses", authUser, getUserAddresses);
router.post("/me/addresses", authUser, addUserAddress);
router.put("/me/addresses/:addressId", authUser, updateUserAddress);
router.delete("/me/addresses/:addressId", authUser, deleteUserAddress);
router.post("/", createUser);
router.get("/", authUser, adminOnly, getUsers);
router.get("/:id", authUser, adminOnly, getUser);
router.put("/:id", authUser, adminOnly, updateUser);
router.delete("/:id", authUser, adminOnly, deleteUser);
