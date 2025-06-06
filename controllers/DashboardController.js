import { Op } from "sequelize";
import Order from "../models/Order.js";
import asyncHandler from "../utils/asyncHandler.js";
import Table from "../models/Table.js";

export const getDetails = asyncHandler(async (req, res) => {
  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  const endOfToday = new Date();
  endOfToday.setHours(23, 59, 59, 999);

  // Filters for today
  const todayFilter = {
    createdAt: {
      [Op.between]: [startOfToday, endOfToday],
    },
  };

  // Get counts
  const [totalOrders, pendingOrders, completedOrders] = await Promise.all([
    Order.count({ where: todayFilter }),
    Order.count({ where: { ...todayFilter, status: "pending" } }),
    Order.count({ where: { ...todayFilter, status: "completed" } }),
  ]);

  // Get last 10 recent orders, pending first
  const recentOrders = await Order.findAll({
    where: todayFilter,
    order: [
      ["status", "ASC"], // Assuming 'pending' comes before 'complete'
      ["createdAt", "DESC"], // Most recent first
    ],
    include: [{ model: Table }],
    limit: 10,
  });

  res.json({
    totalOrders,
    pendingOrders,
    completedOrders,
    recentOrders,
  });
});
