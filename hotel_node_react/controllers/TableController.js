import { Op } from "sequelize";
import AppError from "../errors/CustomError.js";
import Order from "../models/Order.js";
import Table from "../models/Table.js";
import asyncHandler from "../utils/asyncHandler.js";
import { deleteFile, uploadFile } from "../utils/fileUtil.js";
import OrderItem from "../models/OrderItem.js";

export const addTable = asyncHandler(async (req, res) => {
  const { name } = req.body;
  const files = req.files;

  const imageFile = files && files.length > 0 ? files[0] : null;
  let imagePath = null;

  if (!name) {
    throw new AppError("Name is required", 400);
  }

  if (imageFile) {
    imagePath = uploadFile(imageFile, "tables");
  }

  await Table.create({
    name,
    image: imagePath,
  });

  return res.status(200).json({
    success: true,
    message: "Table added successfully",
  });
});

export const getAllTables = asyncHandler(async (req, res) => {
  const tables = await Table.findAll({
    include: [
      {
        model: Order,
        where: { status: { [Op.notIn]: ["cancelled", "completed"] } },
        include: [{ model: OrderItem, required: false }, { model: Table }],
        required: false,
      },
    ],
  });

  return res.status(200).json({
    success: true,
    tables,
  });
});

export const getTableById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Table ID is required", 400);
  }

  const table = await Table.findByPk(id);

  if (!table) {
    throw new AppError("Table not found", 404);
  }

  return res.status(200).json({
    success: true,
    table,
  });
});

export const updateTable = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const files = req.files;

  if (!id) {
    throw new AppError("Table ID is required", 400);
  }

  const table = await Table.findByPk(id);

  if (!table) {
    throw new AppError("Table not found", 404);
  }

  let imagePath = table.image;

  if (files && files.length > 0) {
    const imageFile = files[0];
    deleteFile(imagePath);
    imagePath = uploadFile(imageFile, "tables");
  }

  await table.update({
    name,
    image: imagePath,
  });

  return res.status(200).json({
    success: true,
    message: "Table updated successfully",
  });
});

export const deleteTable = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    throw new AppError("Table ID is required", 400);
  }

  const table = await Table.findByPk(id);

  if (!table) {
    throw new AppError("Table not found", 404);
  }

  const orders = await Order.findAll({ where: { tableId: id } });

  if (orders.length > 0) {
    throw new AppError("Can't delete table", 400);
  }

  if (table.image) {
    deleteFile(table.image);
  }

  await table.destroy();

  return res.status(200).json({
    success: true,
    message: "Table deleted successfully",
  });
});

export const getTableStatus = asyncHandler(async (req, res) => {
  const { tableId } = req.params;
  const order = await Order.findOne({
    where: { tableId, status: { [Op.in]: ["pending", "prepared"] } },
  });
  if (order) {
    throw new AppError("This table allready booked", 400);
  }
  return res.json({ success: true });
});
