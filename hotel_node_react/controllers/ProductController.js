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
  let { title, description, categoryId, varients } = req.body;
  const files = req.files;
  varients = JSON.parse(varients);

  console.log(req.body);

  if (!title && title.toString().trim().length === 0) {
    throw new AppError("Product title is required");
  }

  if (!categoryId && parseInt(categoryId) === 0) {
    throw new AppError("Product category is required");
  }

  if (!varients && varients.length === 0) {
    throw new AppError("Varients are required");
  }

  const productImageFiles = files.filter((f) => f.fieldname.startsWith("img"));

  if (!productImageFiles && productImageFiles.length === 0) {
    throw new AppError("Minimun 1 product image is required");
  }

  for (let i = 0; i < varients.length; i++) {
    let { name, description, price, extraItems, key } = varients[i];

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

    if (extraItems && extraItems.length > 0) {
      for (let j = 0; j < extraItems.length; j++) {
        const { name, key, price } = extraItems[j];

        if (!name && name.toString().trim().length === 0) {
          throw new AppError("Extra items name is required");
        }

        if (
          price === undefined ||
          price === null ||
          isNaN(price) ||
          parseFloat(price) <= 0
        ) {
          throw new AppError(
            "Extra Items price must be a valid positive number"
          );
        }
      }
    }
  }

  const newProduct = await Product.create({
    name: title,
    description,
    categoryId,
  });

  for (let i = 0; i < productImageFiles.length; i++) {
    const img = productImageFiles[i];
    const fileName = await uploadFile(img, "products");
    await Image.create({
      productId: newProduct.id,
      path: fileName,
    });
  }

  for (let i = 0; i < varients.length; i++) {
    let { name, description, price, extraItems } = varients[i];

    const newVarient = await Varient.create({
      productId: newProduct.id,
      name,
      description,
      price,
    });

    if (extraItems && extraItems.length > 0) {
      for (let j = 0; j < extraItems.length; j++) {
        const { name, key, type, price, description } = extraItems[j];

        let fileName = null;

        let imageFile = files.find((f) => f.fieldname === key);

        if (imageFile) {
          fileName = await uploadFile(imageFile, "extra-items");
        }

        await ExtraItem.create({
          varientId: newVarient.id,
          name,
          image: fileName,
          type,
          price,
          description,
        });
      }
    }
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
        include: [{ model: ExtraItem, required: false }],
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
        include: [{ model: ExtraItem, required: false }],
      },
    ],
    limit,
    offset,
  });

  let pageCount = Math.ceil(productsCount / limit);

  return res.json({ success: true, products, pageCount });
});

export const updateProduct = asyncHandler(async (req, res) => {
  let { title, description, categoryId, varients, images } = req.body;
  const files = req.files;
  const { productId } = req.params;
  varients = JSON.parse(varients);

  const existingProduct = await Product.findByPk(productId);

  if (!existingProduct) {
    throw new AppError("Product not found", 404);
  }

  if (!title && title.toString().trim().length === 0) {
    throw new AppError("Product title is required");
  }

  if (!categoryId && parseInt(categoryId) === 0) {
    throw new AppError("Product category is required");
  }

  if (!varients && varients.length === 0) {
    throw new AppError("Varients are required");
  }

  const productImageFiles = files.filter((f) => f.fieldname.startsWith("img"));

  if (
    !productImageFiles &&
    productImageFiles.length === 0 &&
    images?.length === 0
  ) {
    throw new AppError("Minimun 1 product image is required");
  }

  for (let i = 0; i < varients.length; i++) {
    let { name, description, price, extraItems, key } = varients[i];

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

    if (extraItems && extraItems.length > 0) {
      for (let j = 0; j < extraItems.length; j++) {
        const { name, key, price } = extraItems[j];

        if (!name && name.toString().trim().length === 0) {
          throw new AppError("Extra items name is required");
        }

        if (
          price === undefined ||
          price === null ||
          isNaN(price) ||
          parseFloat(price) <= 0
        ) {
          throw new AppError(
            "Extra Items price must be a valid positive number"
          );
        }
      }
    }
  }

  await existingProduct.update({
    name: title,
    description,
    categoryId,
  });

  if (productImageFiles.length > 0) {
    let img = await Image.findOne({ where: { productId } });
    deleteFile(img.path);
    await img.destroy({ where: { productId } });
  }

  for (let i = 0; i < productImageFiles.length; i++) {
    const img = productImageFiles[i];
    const fileName = await uploadFile(img, "products");
    await Image.create({
      productId,
      path: fileName,
    });
  }

  const existsVariants = await Varient.findAll({ where: { productId } });

  for (let i = 0; i < existsVariants.length; i++) {
    let existsExtra = await ExtraItem.findAll({
      where: { varientId: existsVariants[i].id },
    });
    for (let j = 0; j < existsExtra.length; j++) {
      const element = existsExtra[j];
      moveToCache(element?.image);
      deleteFile(element?.image);
    }
    await ExtraItem.destroy({ where: { varientId: existsVariants[i].id } });
  }

  await Varient.destroy({ where: { productId } });

  for (let i = 0; i < varients.length; i++) {
    let { name, description, price, extraItems } = varients[i];

    const newVarient = await Varient.create({
      productId,
      name,
      description,
      price,
    });

    if (extraItems && extraItems.length > 0) {
      for (let j = 0; j < extraItems.length; j++) {
        const { name, key, type, price, description, image } = extraItems[j];

        console.log(image);

        let fileName = null;

        let imageFile = files.find((f) => f.fieldname === key);

        if (image && !imageFile) {
          fileName = image;
          moveFromCache(image);
        }

        if (imageFile) {
          fileName = await uploadFile(imageFile, "extra-items");
        }

        await ExtraItem.create({
          varientId: newVarient.id,
          name,
          image: fileName,
          type,
          price,
          description,
        });
      }
    }
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
      { model: Varient, include: [{ model: ExtraItem, required: false }] },
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

  return res.json({ taxPercentage, showTax });
});

export const saveTax = asyncHandler(async (req, res) => {
  const { taxPercentage, showTaxDetails } = req.body;
  await Option.update({ value: taxPercentage }, { where: { id: 1 } });
  await Option.update(
    { value: showTaxDetails ? "1" : "0" },
    { where: { id: 2 } }
  );
  return res.json({ success: true });
});
