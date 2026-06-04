import mongoose from "mongoose";
import { Order } from "./order.model.js";
import { Cart } from "../carts/cart.model.js";
import { Product } from "../products/product.model.js";
import { User } from "../user/user.model.js";

const SHIPPING_FEE = 30;

export const createOrder = async (req, res, next) => {
  const { addressId, paymentMethod } = req.body;
  const userId = req.user?.userId;

  if (!addressId || !paymentMethod) {
    return res.status(400).json({
      success: false,
      message: "addressId and paymentMethod are required!",
    });
  }

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found!" });
  }

  const address = user.address.id(addressId);
  if (!address) {
    return res.status(404).json({ success: false, message: "Address not found!" });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const cart = await Cart.findOne({ userId }).session(session);
    if (!cart || cart.items.length === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ success: false, message: "Cart is empty!" });
    }

    const orderItems = [];
    for (const item of cart.items) {
      const product = await Product.findById(item.productId).session(session);
      if (!product || !product.isActive) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Product ${item.name} is no longer available!`,
        });
      }
      if (product.quantity < item.quantity) {
        await session.abortTransaction();
        session.endSession();
        return res.status(400).json({
          success: false,
          message: `Not enough stock for ${item.name}. Only ${product.quantity} left!`,
        });
      }
      orderItems.push({
        productId: item.productId,
        productname: item.name,
        price: item.price,
        quantity: item.quantity,
      });
    }

    const subtotal = orderItems.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    const total = subtotal + SHIPPING_FEE;

    const [order] = await Order.create(
      [
        {
          userId,
          items: orderItems,
          deliveryAddress: address.toObject(),
          subtotal,
          shippingFee: SHIPPING_FEE,
          total,
          paymentMethod,
        },
      ],
      { session },
    );

    for (const item of cart.items) {
      await Product.findByIdAndUpdate(
        item.productId,
        { $inc: { quantity: -item.quantity } },
        { session },
      );
    }

    cart.items = [];
    await cart.save({ session });

    await session.commitTransaction();
    session.endSession();

    return res.status(201).json({ success: true, data: order });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
};
