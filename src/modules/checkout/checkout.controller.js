import { Cart } from "../carts/cart.model.js";

export const checkOut = async (req, res, next) => {
  try {
    const userId = req.user.userId;

    // 1. หา cart
    const cart = await Cart.findOne({
      userId,
    }).populate("items.productId");

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    console.log(cart);

    // 2. สร้าง order
    // await Order.create(...)

    // 3. ล้าง cart
    // cart.items = []
    // await cart.save()

    // 4. ส่ง response
    res.status(200).json({
      message: "Checkout success",
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
};