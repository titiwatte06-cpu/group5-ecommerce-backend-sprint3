import { Router } from "express";
import { authUser } from "../middleware/authUser.js"; // protect ด้วย JWT
import { addToCart , removeCartItem , updateCartQuantity , removeCartQuantity } from "../modules/carts/cart.controller.js";


export const router = Router();

router.use(authUser); 

// router.get("/",       getCart);  

router.post("/",      addToCart);  

router.put("/increase/:productId", updateCartQuantity); 

router.put("/decrease/:productId", removeCartQuantity); 

router.delete("/",    removeCartItem); 
