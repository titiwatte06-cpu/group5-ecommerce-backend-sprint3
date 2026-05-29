import { Product } from "./product.model.js";

export const getProducts = async (req, res, next) => {
  try {
    const { q, categoryId } = req.query;
    const filter = { isActive: true };
    if (q) filter.productname = { $regex: q, $options: "i" };
    if (categoryId) filter.categoryId = categoryId;

    const allProducts = await Product.find(filter);
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
    carbs,
    fat,
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
      carbs,
      fat,
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

export const updateProduct = async (req, res, next) => {
  const { id } = req.params;
  const {
    productname,
    price,
    categoryId,
    quantity,
    kcal,
    protein,
    carbs,
    fat,
    tag,
    desc,
    imageUrl,
    isActive,
  } = req.body || {};
  try {
    const foundProduct = await Product.findById(id);
    if (!foundProduct) {
      return res
        .status(404)
        .json({ success: false, message: `Product id ${id} not found!` });
    }
    if (productname !== undefined) foundProduct.productname = productname;

    if (price !== undefined) foundProduct.price = price;

    if (categoryId !== undefined) foundProduct.categoryId = categoryId;

    if (quantity !== undefined) foundProduct.quantity = quantity;

    if (kcal !== undefined) foundProduct.kcal = kcal;

    if (protein !== undefined) foundProduct.protein = protein;
    if (carbs !== undefined) foundProduct.carbs = carbs;
    if (fat !== undefined) foundProduct.fat = fat;

    if (tag !== undefined) foundProduct.tag = tag;

    if (desc !== undefined) foundProduct.desc = desc;

    if (imageUrl !== undefined) foundProduct.imageUrl = imageUrl;

    if (isActive !== undefined) foundProduct.isActive = isActive;

    const saveProduct = await foundProduct.save();
    return res.status(200).json({
      success: true,
      data: saveProduct,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  const { id } = req.params;
  try {
    const foundProduct = await Product.findById(id);
    if (!foundProduct) {
      return res
        .status(404)
        .json({ success: false, message: `Product id ${id} not found!` });
    }
    foundProduct.isActive = false;
    await foundProduct.save();
    return res
      .status(200)
      .json({ success: true, message: `Product id ${id} deactivated` });
  } catch (error) {
    next(error);
  }
};
