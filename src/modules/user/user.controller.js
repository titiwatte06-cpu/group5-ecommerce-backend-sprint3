import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

import { User } from "./user.model.js";
import { authUser } from "../../middleware/authUser.js";

//Function to delete user password (not show) before response back to frontend
const hidePassword = (data) => {
  if (!data) return null;
  //If data is an array of users

  if (Array.isArray(data)) {
    return data.map((eachUser) => hidePassword(eachUser));
  }

  //If data in a Mongoose document, convert to object and then remove password.
  let userObj =
    typeof data.toObject === "function" ? data.toObject() : { ...data };
  delete userObj.password;
  return userObj;
};

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json({ success: true, data: allUsers }); //No need to use hidePassword function because in user.model password select:false.
  } catch (error) {
    next(error);
  }
};

export const getUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: `User id ${id} not found!` });
    }
    return res.status(200).json({ success: true, data: foundUser }); //No need to use hidePassword function because in user.model password select:false.
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  const { username, email, password, tel, role, address } = req.body || {};

  if (!username || !email || !password || !address) {
    return res.status(400).json({
      success: false,
      message:
        "User name, email, password, and all address fields are required",
    });
  }

  try {
    //Check is email is exists
    const emailCheck = await User.findOne({ email });
    if (emailCheck) {
      return res.status(400).json({
        success: false,
        message: `Email is already registered!`,
      });
    }

    const newUser = await User.create({
      username,
      email,
      password,
      tel,
      role,
      address,
    });

    //Remove password from JSON response
    return res.status(201).json({ success: true, data: hidePassword(newUser) }); //Hide password field in response.
  } catch (error) {
    next(error);
  }
};

export const updateUser = async (req, res, next) => {
  const { id } = req.params;
  const { username, email, password, tel, role, address } = req.body || {};
  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: `User id ${id} not found` });
    }
    if (username !== undefined) foundUser.username = username;
    if (email !== undefined) foundUser.email = email;
    if (password !== undefined) foundUser.password = password;
    if (tel !== undefined) foundUser.tel = tel;
    if (role !== undefined) foundUser.role = role;
    if (address !== undefined) foundUser.address = address;

    const saveUser = await foundUser.save();
    return res.status(200).json({
      success: true,
      data: hidePassword(saveUser),
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (req, res, next) => {
  const { id } = req.params;
  try {
    const foundUser = await User.findById(id);
    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: `User id ${id} not found` });
    }
    const username = foundUser.username;
    await foundUser.deleteOne();
    return res.status(200).json({
      success: true,
      message: `User id ${id}-${username} success deleted`,
    });
  } catch (error) {
    next(error);
  }
};

export const userLogin = async (req, res, next) => {
  const { email, password } = req.body || {};

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: `Email and Password is required!` });
  }

  try {
    const foundUser = await User.findOne({ email }).select("+password"); //Because in user.model, password select: false.
    if (!foundUser) {
      return res
        .status(401)
        .json({ success: false, message: `Email '${email}' not found!` });
    }
    const isPasswordMatch = await bcrypt.compare(password, foundUser.password);
    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ success: false, message: `Wrong password!` });
    }

    //After foundUser & Password correct -> Make token
    const token = jwt.sign({ userId: foundUser._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    const isProd = process.env.NODE_ENV === "production";

    //setup token
    res.cookie("accessToken", token, {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax", //IF isProd = "production"(on live server):"none", else "locally": "lax".
      path: "/",
      maxAge: 60 * 60 * 1000, //1 hour
    });
    return res.status(200).json({
      success: true,
      message: "Login success.",
      user: {
        _id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        role: foundUser.role,
      },
    });
  } catch (err) {
    next(err);
  }
};

export const authenUser = async (req, res, next) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: invalid or missing token structure!",
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "User not found!" });
    }
    return res.status(200).json({
      success: true,
      message: "Authentication successful.",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const userLogout = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("accessToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: isProd ? "none" : "lax",
    path: "/",
  });
  return res
    .status(200)
    .json({ success: true, message: "Logged out successfully." });
};

export const getUserAddresses = async (req, res, next) => {
  try {
    //Get userId by authUser middleware
    const userId = req.user?.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "No user identified token!" });
    }

    //Fetch user details and target address field
    const foundUser = await User.findById(userId);
    if (!foundUser) {
      return res
        .status(400)
        .json({ success: false, message: "User account not found!" });
    }

    //Return array of addresses (even empty)
    return res.status(200).json({
      success: true,
      count: foundUser.address.length,
      data: foundUser.address,
    });
  } catch (error) {
    next(error);
  }
};

export const addUserAddress = async (req, res, next) => {
  const { label, recieveName, recieveAddress, recieveTel, isDefault } =
    req.body || {};

  if (!label || !recieveName || !recieveAddress || !recieveTel) {
    return res.status(400).json({
      success: false,
      message:
        "Label, Recieve name, Recieve address, Recieve Tel are all required! ",
    });
  }

  try {
    const userId = req.user?.userId;
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: "User account not found!" });
    }

    //If this new address isDefault = true, change all other existing address isDefault = false first.
    if (isDefault === true) {
      foundUser.address.forEach((address) => {
        address.isDefault = false;
      });
    }

    //Append new address to user's address
    foundUser.address.push({
      label,
      recieveName,
      recieveAddress,
      recieveTel,
      isDefault: isDefault !== undefined ? isDefault : false, //If not specified, set to false
    });

    await foundUser.save();

    return res.status(201).json({
      success: true,
      message: "New address added successfully!",
      data: foundUser.address,
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserAddress = async (req, res, next) => {
  const { addressId } = req.params;
  const { label, recieveName, recieveAddress, recieveTel, isDefault } =
    req.body || {};

  if (Object.keys(req.body || {}).length === 0) {
    return res.status(400).json({
      success: false,
      message: "At least one field is required to update!",
      debug: {
        body: req.body,
        contentType: req.headers["content-type"],
      },
    });
  }

  try {
    const userId = req.user?.userId;
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: "User account not found!" });
    }

    const targetAddress = foundUser.address.id(addressId);
    if (!targetAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Not found existing address!" });
    }

    //Change all others address isDefault to false if the one to update is set to default
    if (isDefault === true) {
      foundUser.address.forEach((address) => {
        address.isDefault = false;
      });
    }

    //Apply only fields that provided in request
    if (label !== undefined) targetAddress.label = label;
    if (recieveName !== undefined) targetAddress.recieveName = recieveName;
    if (recieveAddress !== undefined)
      targetAddress.recieveAddress = recieveAddress;
    if (recieveTel !== undefined) targetAddress.recieveTel = recieveTel;
    if (isDefault !== undefined) targetAddress.isDefault = isDefault;

    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: "Address updated successfully!",
      data: foundUser.address,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteUserAddress = async (req, res, next) => {
  const { addressId } = req.params;

  try {
    const userId = req.user?.userId;
    const foundUser = await User.findById(userId);

    if (!foundUser) {
      return res
        .status(404)
        .json({ success: false, message: "User account not found!" });
    }

    //Verify if target address exists in array
    const targetAddress = foundUser.address.id(addressId);

    if (!targetAddress) {
      return res
        .status(404)
        .json({ success: false, message: "Address not found! " });
    }

    const addressLabel = targetAddress.label; //Prepare for use in response message.

    //Remove address from array
    foundUser.address.pull(addressId);

    await foundUser.save();

    return res.status(200).json({
      success: true,
      message: `Address ${addressLabel} deleted successfully`,
    });
  } catch (error) {
    next(error);
  }
};
