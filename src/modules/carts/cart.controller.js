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
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found or inactive!" });
    }

    //Check available
    if (product.quantity < quantity) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock, Only ${product.quantity} items left!`,
      });
    }

    //Find or create new cart for user
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    //Check if item already in cart(array).
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );

    //If found in array (index>-1), because -1 = not found.
    if (itemIndex > -1) {
      //Case 1: product exists, check combined stock then increment quantity.
      const newQuantity = cart.items[itemIndex].quantity + quantity;
      // In case of new quantity > available
      if (product.quantity < quantity) {
        return res.status(400).json({
          success: false,
          message: "Can not add more, item available not enough!",
        });
      }
      cart.items[itemIndex].quantity = newQuantity;
    } else {
      // Case 2: New product add to cart
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    // Update product stock quantity and save to product document.
    product.quantity -= quantity;
    await product.save();

    //Return updated cart
    const updateCart = await Cart.findOne({ userId }).populate(
      "items.productId",
    );
    return res.status(200).json({
      success: true,
      message: "Item added to cart successfully!",
      data: updateCart,
    });
  } catch (error) {
    next(error);
  }
};

export const getCart = async (req, res, next) => {
  try {
    const userId = req.user?.userId; //Get userId from authUser middleware
    //Find cart and brings all details
    const foundCart = await Cart.findOne({ userId }).populate(
      "items.productId",
    );

    if (!foundCart) {
      return res.status(200).json({ success: true, message: "Cart is empty!" });
    }

    return res.status(200).json({
      success: true,
      message: "Cart fetch successfully",
      data: foundCart,
    });
  } catch (error) {
    next(error);
  }
};

export const updateCartQuantity = async (req, res, next) => {
  const { productId, quantity } = req.body || {};

  if (!productId || quantity === undefined) {
    return res.status(400).json({
      success: false,
      message: "Product ID and quantity are required!",
    });
  }

  if (quantity < 1) {
    return res.status(400).json({
      success: false,
      message: "Quantity must be at 1! Use remove route to delete product.",
    });
  }

  try {
    const userId = req.user?.userId;

    //Fetch cart and product
    const { cart, product } = await Promise.all([
      Cart.findOne({ userId }),
      Product.findById(productId),
    ]);

    if (!cart) {
      return res
        .status(404)
        .json({ success: false, message: "Cart not found!" });
    }
    if (!product || !product.isActive) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found!" });
    }

    //Find item index in cart array
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId,
    );
    if (itemIndex === -1) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found in cart!" });
    }

    const currentCartQty = cart.items[itemIndex].quantity;
    const qtyDifference = quantity - currentCartQty; // Positive if increase, negative if decrease

    //if increase, check if stock enough
    if (qtyDifference > 0 && product.quantity < qtyDifference) {
      return res.status(400).json({
        success: false,
        message: `Not enough stock! Only ${product.quantity} item in stock.`,
      });
    }

    //Update cart quantity first
    cart.items[itemIndex].quantity = quantity;
    await cart.save();

    const updateCart = await Cart.findOne({ userId }).populate(
      "item.productId",
    );
    return res
      .status(200)
      .json({ success: true, message: "Cart updated successfully!" });
  } catch (error) {
    next(error);
  }
};
