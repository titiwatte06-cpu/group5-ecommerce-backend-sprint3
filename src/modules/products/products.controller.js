import { Product } from "./product.model.js";

export const getProducts = async (req, res, next) => {
  try {
    const { productname, sort, categoryId } = req.query;
    let filter = { isActive: true }; //Show only product "isActive: true"

    if (productname) {
      filter.productname = { $regex: productname, $options: "i" };
    }

    if (categoryId) {
      filter.categoryId = categoryId;
    }

    let query = Product.find(filter);

    if (sort === "price_asc") {
      query = query.sort({ price: 1 });
    } else if (sort === "price_dsc") {
      query = query.sort({ price: -1 });
    }

    const products = await query;
    return res
      .status(200)
      .json({ success: true, count: products.length, data: products });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundProduct = await Product.findOne({ _id: id, isActive: true }); //Show only product "isActive: true"
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
      quantity: quantity === null || quantity === undefined ? 1 : quantity, //Prevent null value, default: 1
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

    if (quantity !== undefined) {
      foundProduct.quantity = quantity === null ? 1 : quantity;
    } //Prevent null value send to database, default is 1.

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

    //Soft delete by set isActive: false
    foundProduct.isActive = false;
    await foundProduct.save();
    return res.status(200).json({
      success: true,
      message: `Product ${foundProduct.productname} deactivated`,
    });
  } catch (error) {
    next(error);
  }
};
