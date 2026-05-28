import mongoose from "mongoose";
const productSchema = new mongoose.Schema(
  {
    productname: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    quantity: {
      type: Number,
      default: 1,
    },
    kcal: {
      type: Number,
    },
    protein: {
      type: String,
    },
    tag: {
      type: String,
    },
    desc: {
      type: String,
    },
    imageUrl: { type: String },
    isActive: { type: Boolean, default: true },
  },

  { timestamps: true },
);

export const Product = mongoose.model("Product", productSchema);
