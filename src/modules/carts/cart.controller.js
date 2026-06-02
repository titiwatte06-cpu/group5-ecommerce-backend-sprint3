import { Cart } from "./cart.model.js";
import { Product } from "../products/product.model.js"; //For fetch productname, price, imageUrl from products.

export const addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body || {};

  if (!productId) {
    return res
      .status(400)
      .json({ success: false, message: "Product ID is required!" });
  }

  try {
    const userId = req.user?.userId; //Get userId from authUser middleware

    const product = await Product.findById(productId);

    
  } catch (error) {
    next(error);
  }
};
