import mongoose from "mongoose";
import bcrypt from "bcrypt";

import { addressSchema } from "../address/address.model.js";

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false, //Set for prevent return password to client.
  },
  tel: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["user", "admin"],
    default: "user",
  },
  address: [addressSchema],
}, { timestamps: true });

//Convert password use bcrypt.hash before save.
userSchema.pre("save", async function () {
  //If password didn't change, do not convert
  if (!this.isModified("password")) {
    return;
  }
  //If password change (or new user), bcrypt password
  try {
    this.password = await bcrypt.hash(this.password, 12);
  } catch (error) {
    throw error;
  }
});

export const User = mongoose.model("User", userSchema);
