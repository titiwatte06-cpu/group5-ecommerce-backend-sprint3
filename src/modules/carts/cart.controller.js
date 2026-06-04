import { Cart } from "./cart.model.js";
import { Product } from "../products/product.model.js"; //For fetch productname, price, imageUrl from products.


export const addToCart = async (req, res, next) => {
  const { productId, quantity = 1 } = req.body || {};

  if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID is required!" });
  }

  if (!Number.isInteger(quantity) || quantity < 1) {
  return res.status(400).json({
    success: false,
    message: "Quantity must be a positive integer",
  });
}

  try {
    const userId = req.user?.userId;

    // 1. หา product และเช็คสต็อก
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found!" });
    }

// 2. หา cart ของ user นี้ ถ้าไม่มีก็สร้างใหม่
    let cart = await Cart.findOne({ userId });
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }

    // 3. เช็คว่า product นี้อยู่ใน cart แล้วหรือยัง
    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    const currentInCart = existingItem ? existingItem.quantity : 0;
    if (product.quantity < currentInCart + quantity) {
      return res.status(400).json({ success: false, message: "Not enough stock!" });
    }

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({
        productId,
        quantity,
        price: product.price,
        name: product.productname,
        imageUrl: product.imageUrl,
      });
    }

    // 4. save
    await cart.save();

    res.status(200).json({ success: true, data: cart });

  } catch (error) {
    next(error);
  }
};

export const updateCartQuantity = async (req, res, next) => {
  const { productId } = req.params;
  // ลบ const { quantity } = req.body ออก

  try {
    const userId = req.user?.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart!" });
    }

    const product = await Product.findById(productId);
    if (product.quantity <= item.quantity) {  // stock เหลือพอบวกอีกไหม
      return res.status(400).json({ success: false, message: "Not enough stock!" });
    }

    item.quantity += 1;  // บวกทีละ 1 เลย
    await cart.save();

    res.status(200).json({ success: true, data: cart });

  } catch (error) {
    next(error);
  }
};

export const removeCartQuantity = async (req, res, next) => {
  const { productId } = req.params;

  try {
    const userId = req.user?.userId;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    const item = cart.items.find(
      (item) => item.productId.toString() === productId
    );
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found in cart!" });
    }

    // ลบ product.findById ออกได้เลย ไม่จำเป็น

    // edge case: ถ้าเหลือ 1 แล้วกด - อีก ให้ลบ item ออกจาก cart เลย
    if (item.quantity <= 1) {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );
    } else {
      item.quantity -= 1;
    }

    await cart.save();
    res.status(200).json({ success: true, data: cart });

  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  const { productId } = req.body;

  if (!productId) {
    return res.status(400).json({ success: false, message: "Product ID is required!" });
  }

  try {
    const userId = req.user?.userId;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { items: { productId } } },
      { new: true }
    );

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found!" });
    }

    res.status(200).json({ success: true, data: cart });

  } catch (error) {
    next(error);
  }
};