import { User } from "./user.model.js";

export const getUsers = async (req, res, next) => {
  try {
    const allUsers = await User.find();
    return res.status(200).json({ success: true, data: allUsers });
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
    return res.status(200).json({ success: true, data: foundUser });
  } catch (error) {
    next(error);
  }
};

export const createUser = async (req, res, next) => {
  const { username, email, password, tel, role, address } = req.body || {};
  if (!username || !email || !password || !address || !tel) {
    return res.status(400).json({
      success: false,
      message: "User,email,password,address,tel is required",
    });
  }
  try {
    const newUser = await User.create({
      username,
      email,
      password,
      tel,
      role,
      address,
    });
    return res.status(201).json({ success: true, data: newUser });
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
      data: saveUser,
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
    await foundUser.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: `User id ${id} success deleted` });
  } catch (error) {
    next(error);
  }
};
