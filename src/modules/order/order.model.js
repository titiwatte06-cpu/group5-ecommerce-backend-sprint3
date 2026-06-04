import mongoose from "mongoose";

import { orderItemSchema } from "./orderItem.model.js";
import { addressSchema } from "../user/address.model.js";

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [orderItemSchema],
    deliveryAddress: {
      type: addressSchema,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
      default: 30,
    },
    total: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
      enum: {
        values: ["Cash on Delivery", "Bank transfer"],
      },
    },
    status: {
      type: String,
      required: true,
      default: "Pending",
      enum: {
        values: ["Pending", "Paid", "On deliverly", "Delivered", "Cancelled"],
      },
    },
  },
  { timestamps: true },
);
