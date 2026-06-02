import mongoose from "mongoose";

//price, imageUrl with call from Product when user add product to cart.
const classSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
      unique: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          require: true,
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
          min: [1, "Quantity should at lease 1"],
        },
      },
    ],
  },
  { timestamps: true },
);

export const Cart = mongoose.model("Cart", classSchema);
