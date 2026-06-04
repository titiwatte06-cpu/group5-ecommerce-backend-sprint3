import mongoose from "mongoose";

export const orderItemSchema = new mongoose.Schema({
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
    required: true,
  },
  productname: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Price cannot be nagative"],
  },
  quantity: {
    type: Number,
    required: true,
    min: [1, "Quantity must be at least 1"],
  },
});
