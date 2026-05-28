import { Product } from "./product.model.js";

export const getProducts = async (req, res, next) => {
  try {
    const allProducts = await Product.find();
    return res.status(200).json({ success: true, data: allProducts });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundProduct = await Product.findById(id);
    if (!foundProduct) {
      return res
        .status(404)
        .json({ success: false, message: `Product id ${id} not found!` });
    }
    return res.status(200).json({ success: true, data: foundProduct });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  const {
    productname,
    price,
    categoryId,
    quantity,
    kcal,
    protein,
    tag,
    desc,
    imageUrl,
    isActive,
  } = req.body || {};

  if (!productname || !price || !categoryId) {
    return res.status(400).json({
      success: false,
      message: "Productname, Price, Category ID is required!",
    });
  }
  try {
    const newProduct = await Product.create({
      productname,
      price,
      categoryId,
      quantity,
      kcal,
      protein,
      tag,
      desc,
      imageUrl,
      isActive,
    });
    return res.status(201).json({ success: true, data: newProduct });
  } catch (error) {
    next(error);
  }
};
