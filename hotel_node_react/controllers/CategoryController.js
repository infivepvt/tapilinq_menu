import AppError from "../errors/CustomError.js";
import Category from "../models/Category.js";
import Product from "../models/Products.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFile, uploadFile } from "../utils/fileUtil.js";

export const addCategory = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const files = req.files;

  const imageFile = files && files.length > 0 ? files[0] : null;
  let imagePath = null;

  if (!name) {
    throw new AppError("Name is required", 400);
  }

  if (imageFile) {
    imagePath = uploadFile(imageFile, "categories");
  }

  await Category.create({
    name,
    image: imagePath,
  });

  return res.status(200).json({
    success: true,
    message: "Category added successfully",
  });
});

export const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.findAll();

  return res.status(200).json({
    success: true,
    categories,
  });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Category ID is required", 400);
  }

  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  return res.status(200).json({
    success: true,
    category,
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const files = req.files;

  const imageFile = files && files.length > 0 ? files[0] : null;

  if (!id) {
    throw new AppError("Category ID is required", 400);
  }

  if (!name) {
    throw new AppError("Name is required", 400);
  }

  const category = await Category.findByPk(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  let imagePath = category.image;

  if (imageFile) {
    deleteFile(imagePath);
    imagePath = uploadFile(imageFile, "categories");
  }

  await category.update({
    name,
    image: imagePath,
  });

  return res.status(200).json({
    success: true,
    message: "Category updated successfully",
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Category ID is required", 400);
  }

  const category = await Category.findByPk(id, {
    include: [{ model: Product }],
  });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  if (category.Products.length > 0) {
    throw new AppError(
      "Cannot delete this category. This category contains products",
      400
    );
  }

  if (category.image) {
    deleteFile(category.image);
  }

  await category.destroy();

  return res.status(200).json({
    success: true,
    message: "Category deleted successfully",
  });
});
