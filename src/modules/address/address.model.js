import mongoose from "mongoose";

export const addressSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  recieveName: {
    type: String,
    required: true,
  },
  recieveAddress: {
    type: String,
    required: true,
  },
  recieveTel: {
    type: String,
    required: true,
  },
  isDefault: {
    type: Boolean,
    default: true,
  },
});
