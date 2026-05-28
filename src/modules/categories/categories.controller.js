import { Category } from "./category.model.js";

export const getCategories = async (req, res, next) => {
  try {
    const allCategories = await Category.find();
    return res.status(200).json({ success: true, data: allCategories });
  } catch (error) {
    next(error);
  }
};

export const getCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    const foundCategory = await Category.findById(id);
    if (!foundCategory) {
      return res
        .status(404)
        .json({ success: false, message: `Category ID ${id} not found!` });
    }
    return res.status(200).json({ success: true, data: foundCategory });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  const { categoryname } = req.body || {};

  if (!categoryname) {
    return res
      .status(400)
      .json({ success: false, message: "Category name is required!" });
  }

  try {
    const newCategory = await Category.create({
      categoryname,
    });
    return res.status(201).json({ success: true, data: newCategory });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  const { id } = req.params;
  const { categoryname } = req.body || {};

  try {
    const foundCategory = await Category.findById(id);
    if (!foundCategory) {
      return res
        .status(404)
        .json({ success: false, message: `Category ID ${id} not found!` });
    }
    if (categoryname) foundCategory.categoryname = categoryname;

    const saveCategory = await foundCategory.save();
    return res.status(200).json({ success: true, data: saveCategory });
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  const { id } = req.params;

  try {
    const foundCategory = await Category.findById(id);
    if (!foundCategory) {
      return res
        .status(404)
        .json({ success: false, message: `Category ID ${id} not found!` });
    }

    await foundCategory.deleteOne();
    return res
      .status(200)
      .json({ success: true, message: `Category ID ${id} delete successful!` });
  } catch (error) {
    next(error);
  }
};
