import mongoose from "mongoose";

//price, imageUrl with call from Product when user add product to cart.
const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: [1, "Quantity should at least 1"],
        },

        price: { type: Number, required: true },
        name: { type: String },
        imageUrl: { type: String },
      },
    ],
  },
  { timestamps: true },
);

export const Cart = mongoose.model("Cart", cartSchema);
