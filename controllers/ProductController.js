import { Op } from "sequelize";
import AppError from "../errors/CustomError.js";
import Category from "../models/Category.js";
import ExtraItem from "../models/ExtraItem.js";
import Image from "../models/Image.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Products.js";
import Varient from "../models/Varient.js";
import asyncHandler from "../utils/asyncHandler.js";
import {
  deleteFile,
  moveFromCache,
  moveToCache,
  uploadFile,
} from "../utils/fileUtil.js";
import Option from "../models/Options.js";

export const addProduct = asyncHandler(async (req, res) => {
  let { title, description, categoryId, varients, extraItems, price } =
    req.body;
  const files = req.files;

  varients = JSON.parse(varients || "[]");
  extraItems = JSON.parse(extraItems || "[]");

  console.log(req.body);

  if (!title && title.toString().trim().length === 0) {
    throw new AppError("Product title is required");
  }

  if (!categoryId && parseInt(categoryId) === 0) {
    throw new AppError("Product category is required");
  }

  if (
    (price === undefined ||
      price === null ||
      isNaN(price) ||
      parseFloat(price) <= 0) &&
    varients.length === 0
  ) {
    throw new AppError("Product price must be a valid positive number");
  }

  const productImageFiles = files.filter((f) => f.fieldname.startsWith("img"));

  if (!productImageFiles || productImageFiles.length === 0) {
    throw new AppError("Product image is required");
  }

  for (let i = 0; i < varients.length; i++) {
    let { name, description, price, key } = varients[i];

    if (!name && name.toString().trim().length === 0) {
      throw new AppError("Varients name is required");
    }

    if (!price && price.toString().trim().length === 0) {
      throw new AppError("Varients price is required");
    }

    if (
      price === undefined ||
      price === null ||
      isNaN(price) ||
      parseFloat(price) <= 0
    ) {
      throw new AppError("Variant price must be a valid positive number");
    }
  }

  for (let j = 0; j < extraItems.length; j++) {
    const { name, key, price } = extraItems[j];

    if (!name && name.toString().trim().length === 0) {
      throw new AppError("Extra items name is required");
    }
  }

  const newProduct = await Product.create({
    name: title,
    description,
    categoryId,
  });

  for (let i = 0; i < productImageFiles.length; i++) {
    const img = productImageFiles[i];
    const fileName = uploadFile(img, "products");
    await Image.create({
      productId: newProduct.id,
      path: fileName,
    });
  }

  if (varients.length === 0) {
    await Varient.create({
      productId: newProduct.id,
      name: "Default",
      description,
      price,
    });
  }

  for (let i = 0; i < varients.length; i++) {
    let { name, description, price, extraItems, key } = varients[i];

    let fileName = null;

    let imageFile = files.find((f) => f.fieldname === key);

    if (imageFile) {
      fileName = uploadFile(imageFile, "varients");
    }

    let newPrice = price;

    if (
      price === undefined ||
      price === null ||
      isNaN(price) ||
      parseFloat(price) <= 0
    ) {
      newPrice = 0;
    }

    await Varient.create({
      productId: newProduct.id,
      name,
      description,
      price,
      image: fileName,
    });
  }

  for (let j = 0; j < extraItems.length; j++) {
    const { name, key, type, price, description } = extraItems[j];

    let fileName = null;

    let imageFile = files.find((f) => f.fieldname === key);

    if (imageFile) {
      fileName = uploadFile(imageFile, "extra-items");
    }

    let newPrice = price;

    if (
      price === undefined ||
      price === null ||
      isNaN(price) ||
      parseFloat(price) <= 0
    ) {
      newPrice = 0;
    }

    await ExtraItem.create({
      productId: newProduct.id,
      name,
      image: fileName,
      type,
      price: newPrice,
      description,
    });
  }

  return res.json({ success: true, message: "New product added success" });
});

export const getProducts = asyncHandler(async (req, res) => {
  let { page, search, category } = req.query;
  if (!page) {
    page = 1;
  } else {
    page = parseInt(page);
  }

  let limit = 20;
  let offset = limit * (page - 1);

  const productsCount = await Product.count({
    include: [
      {
        model: Category,
      },
      {
        model: Image,
      },
      {
        model: Varient,
        required: false,
      },
      {
        model: ExtraItem,
        required: false,
      },
    ],
    where: {
      name: { [Op.like]: `%${search}%` },
      ...(category && parseInt(category) !== 0
        ? {
            categoryId: category,
          }
        : {}),
    },
  });

  const products = await Product.findAll({
    where: {
      name: { [Op.like]: `%${search}%` },
      ...(category && parseInt(category) !== 0
        ? {
            categoryId: category,
          }
        : {}),
    },
    include: [
      {
        model: Category,
      },
      {
        model: Image,
      },
      {
        model: Varient,
        required: false,
      },
      {
        model: ExtraItem,
        required: false,
      },
    ],
    limit,
    offset,
  });

  let pageCount = Math.ceil(productsCount / limit);

  return res.json({ success: true, products, pageCount });
});

export const updateProduct = asyncHandler(async (req, res) => {
  let { title, description, categoryId, varients, extraItems, price } =
    req.body;
  const files = req.files;
  const { productId } = req.params;

  varients = JSON.parse(varients || "[]");
  extraItems = JSON.parse(extraItems || "[]");

  console.log(req.body);

  const existProduct = await Product.findByPk(productId);

  if (!existProduct) {
    throw new AppError("Product not found", 404);
  }

  if (!title && title.toString().trim().length === 0) {
    throw new AppError("Product title is required", 400);
  }

  if (!categoryId && parseInt(categoryId) === 0) {
    throw new AppError("Product category is required", 400);
  }

  if (
    (price === undefined ||
      price === null ||
      isNaN(price) ||
      parseFloat(price) <= 0) &&
    varients.length === 0
  ) {
    throw new AppError("Product price must be a valid positive number");
  }

  const productImageFiles = files.filter((f) => f.fieldname.startsWith("img"));

  const singleImage = req.body.img_;
  console.log(singleImage);

  if (!singleImage && (!productImageFiles || productImageFiles.length === 0)) {
    throw new AppError("Product image is required");
  }

  for (let i = 0; i < varients.length; i++) {
    let { name, description, price, key } = varients[i];

    if (!name && name.toString().trim().length === 0) {
      throw new AppError("Varients name is required");
    }

    if (!price && price.toString().trim().length === 0) {
      throw new AppError("Varients price is required");
    }

    if (
      price === undefined ||
      price === null ||
      isNaN(price) ||
      parseFloat(price) <= 0
    ) {
      throw new AppError("Variant price must be a valid positive number");
    }
  }

  for (let j = 0; j < extraItems.length; j++) {
    const { name, key, price } = extraItems[j];

    if (!name && name.toString().trim().length === 0) {
      throw new AppError("Extra items name is required");
    }
  }

  await existProduct.update({
    name: title,
    description,
    categoryId,
  });

  // DELETE PRODUCT IMAGES

  const productImages = await Image.findAll({ where: { productId } });

  for (let i = 0; i < productImages.length; i++) {
    if (productImages[i]?.path && productImages[i]?.path !== singleImage)
      deleteFile(productImages[i].path);
  }

  await Image.destroy({ where: { productId } });

  if (singleImage) {
    await Image.create({
      productId,
      path: singleImage,
    });
  }

  // DELETE PRODUCT IMAGES

  for (let i = 0; i < productImageFiles.length; i++) {
    const img = productImageFiles[i];
    const fileName = uploadFile(img, "products");
    await Image.create({
      productId,
      path: fileName,
    });
  }

  // DISABLE VARIENTS

  await Varient.update(
    {
      productId: null,
      deleted: 1,
      deleteProductId: productId,
    },
    { where: { productId } }
  );

  // DISABLE VARIENTS

  if (varients.length === 0) {
    await Varient.create({
      productId,
      name: "Default",
      description,
      price,
    });
  }

  for (let i = 0; i < varients.length; i++) {
    let { name, description, price, extraItems, key } = varients[i];

    let fileName = null;

    let imageFile = files.find((f) => f.fieldname === key);

    if (imageFile) {
      fileName = uploadFile(imageFile, "varients");
    }

    let newPrice = price;

    if (
      price === undefined ||
      price === null ||
      isNaN(price) ||
      parseFloat(price) <= 0
    ) {
      newPrice = 0;
    }

    await Varient.create({
      productId: productId,
      name,
      description,
      price,
      image: fileName,
    });
  }

  // DISABLE EXTRA ITEMS

  await ExtraItem.update(
    {
      productId: null,
      deleted: 1,
      deleteProductId: productId,
    },
    { where: { productId } }
  );

  // DISABLE EXTRA ITEMS

  for (let j = 0; j < extraItems.length; j++) {
    const { name, key, type, price, description } = extraItems[j];

    let fileName = null;

    let imageFile = files.find((f) => f.fieldname === key);

    if (imageFile) {
      fileName = uploadFile(imageFile, "extra-items");
    }

    let newPrice = price;

    if (
      price === undefined ||
      price === null ||
      isNaN(price) ||
      parseFloat(price) <= 0
    ) {
      newPrice = 0;
    }

    await ExtraItem.create({
      productId: productId,
      name,
      image: fileName,
      type,
      price: newPrice,
      description,
    });
  }

  return res.json({ success: true, message: "Product updated success" });
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const product = await Product.findByPk(id);

  const varients = await Varient.findAll({ where: { productId: id } });

  for (let i = 0; i < varients.length; i++) {
    let vari = varients[i];
    const items = await OrderItem.findAll({ where: { varientId: vari.id } });
    if (items.length > 0) {
      throw new AppError(
        "This product can't delete. Because product has some orders",
        400
      );
    }
  }

  for (let i = 0; i < varients.length; i++) {
    let vari = varients[i];
    let extraItems = await ExtraItem.findAll({ where: { varientId: vari.id } });
    for (let j = 0; j < extraItems.length; j++) {
      const extr = extraItems[j];
      deleteFile(extr.image);
    }
    await ExtraItem.destroy({ where: { varientId: vari.id } });
  }

  await Varient.destroy({ where: { productId: id } });

  const image = await Image.findOne({ where: { productId: id } });
  if (image) {
    deleteFile(image.path);
    await image.destroy();
  }

  await product.destroy();

  return res.json({ success: true, message: "Product deleted" });
});

export const getActiveProducts = asyncHandler(async (req, res) => {
  const { category, search } = req.query;
  const products = await Product.findAll({
    where: {
      status: "active",
      ...(search && search.trim().length > 0
        ? { name: { [Op.like]: `%${search}%` } }
        : {}),
    },
    include: [
      {
        model: Category,
        where: {
          ...(category && category.trim().length > 0 && category !== "All"
            ? { name: { [Op.like]: `%${category}%` } }
            : {}),
        },
      },
      { model: Varient, required: false },
      { model: ExtraItem, required: false },
      { model: Image },
    ],
  });
  return res.json({ products });
});

export const loadTaxDetails = asyncHandler(async (req, res) => {
  const taxAmountData = await Option.findByPk(1);
  const taxPercentage = taxAmountData.dataValues.value;
  const taxShowData = await Option.findByPk(2);
  const showTax = parseInt(taxShowData.dataValues.value) === 1;

  const scAmoData = await Option.findByPk(3);
  const scPercentage = scAmoData.dataValues.value;
  const scShowData = await Option.findByPk(4);
  const showsc = parseInt(scShowData.dataValues.value) === 1;

  return res.json({
    taxPercentage,
    showTax,
    serviceChargePercentage: scPercentage,
    showServiceCharge: showsc,
  });
});

export const saveTax = asyncHandler(async (req, res) => {
  const {
    taxPercentage,
    showTaxDetails,
    servicePercentage,
    showServiceDetails,
  } = req.body;
  await Option.update({ value: taxPercentage }, { where: { id: 1 } });
  await Option.update(
    { value: showTaxDetails ? "1" : "0" },
    { where: { id: 2 } }
  );
  await Option.update({ value: servicePercentage }, { where: { id: 3 } });
  await Option.update(
    { value: showServiceDetails ? "1" : "0" },
    { where: { id: 4 } }
  );
  return res.json({ success: true });
});
