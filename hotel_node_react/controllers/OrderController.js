import { Op, where } from "sequelize";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import AppError from "../errors/CustomError.js";
import { generateOrderId } from "../utils/numberUtil.js";
import OrderItem from "../models/OrderItem.js";
import Varient from "../models/Varient.js";
import Table from "../models/Table.js";
import User from "../models/User.js";
import { io } from "../socket.js";
import Option from "../models/Options.js";

export const newOrder = asyncHandler(async (req, res) => {
  const { items, tableNumber, totalAmount, customerName, subTotal } = req.body;
  const existsOrder = await Order.findOne({
    where: { tableId: tableNumber, status: { [Op.in]: ["pending", "served"] } },
  });
  if (existsOrder) {
    throw new AppError("This table allready booked", 400);
  }

  let orderId = generateOrderId();

  let taxData = await Option.findByPk(1);
  let taxPercentage = parseFloat(taxData.dataValues.value);

  let taxAmount = (parseFloat(subTotal) / 100) * taxPercentage;

  const newOrder = await Order.create({
    orderId: orderId,
    customerName,
    tableId: tableNumber,
    total: totalAmount,
    tax: taxAmount,
  });

  // Order Items

  if (!items || items.length === 0) {
    throw new AppError("Please select foods to process order", 400);
  }

  for (let i = 0; i < items.length; i++) {
    const food = items[i];

    const added = food.addedIngredients.reduce(
      (acc, ing) => acc + ing.price,
      0
    );
    const removed = food.removedIngredients.reduce(
      (acc, ing) => acc + ing.price,
      0
    );

    await OrderItem.create({
      orderId: newOrder.id,
      properties: JSON.stringify(food),
      varientId: food.variant.id,
      price: food.variant.price,
      quantity: food.quantity,
      extraPrice: added,
      priceDeduction: removed,
      total:
        (parseFloat(food.variant.price) + added - removed) *
        parseInt(food.quantity),
    });
  }

  // Order Items

  return res.json({
    success: true,
    message: "Your order placed success",
    orderId,
  });
});

export const getCustomerOrders = asyncHandler(async (req, res) => {
  const { orders } = req.body;

  const pastOrders = await Order.findAll({
    where: { orderId: { [Op.in]: orders } },
    include: [{ model: OrderItem }, { model: Table }],
    order: [["id", "desc"]],
  });

  return res.json({ success: true, pastOrders });
});

export const getOrdersAdmin = asyncHandler(async (req, res) => {
  const orders = await Order.findAll({
    include: [
      { model: User, as: "waiter" },
      { model: OrderItem },
      { model: Table },
    ],
    order: [["id", "desc"]],
  });

  return res.json({ orders });
});

export const assignWaiter = asyncHandler(async (req, res) => {
  const { orderId, waiterId } = req.body;
  const order = await Order.findByPk(orderId);
  await order.update({ waiterId });
  return res.json({ success: true, message: "Waiter assigned success" });
});

export const getOrderByOrderId = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findOne({
    where: { orderId },
    include: [
      { model: User, as: "waiter" },
      { model: OrderItem },
      { model: Table },
    ],
  });
  return res.json({ success: true, order });
});

export const acceptOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Order.update({ status: "preparing" }, { where: { orderId: id } });
  io.to("customer").emit("changeOrderStatus", {
    orderId: id,
    message: "Your order accepted",
  });
  io.to("admin").emit("refetchOrders");
  return res.json({ success: true, message: "Order accepted" });
});

export const completePrepare = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Order.update({ status: "prepared" }, { where: { orderId: id } });
  io.to("customer").emit("changeOrderStatus", {
    orderId: id,
    message: "Your order prepared. Please wait to deliver",
  });
  io.to("admin").emit("refetchOrders");
  return res.json({ success: true, message: "Order accepted" });
});

export const serveOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Order.update({ status: "served" }, { where: { orderId: id } });
  io.to("customer").emit("changeOrderStatus", {
    orderId: id,
    message: "Your order served. Enjoy",
  });
  io.to("admin").emit("refetchOrders");
  return res.json({ success: true, message: "Order accepted" });
});

export const completeOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Order.update({ status: "completed" }, { where: { orderId: id } });
  io.to("customer").emit("changeOrderStatus", {
    orderId: id,
    message: "Your order completed.",
  });
  io.to("admin").emit("refetchOrders");
  return res.json({ success: true, message: "Order accepted" });
});

export const cancleOrder = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await Order.update({ status: "cancelled" }, { where: { orderId: id } });
  io.to("customer").emit("changeOrderStatus", {
    orderId: id,
    message: "Your order cancelled.",
  });
  io.to("admin").emit("refetchOrders");
  return res.json({ success: true, message: "Order accepted" });
});
