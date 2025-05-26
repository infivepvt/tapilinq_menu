import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";

export const getWaiters = asyncHandler(async (req, res) => {
  const waiters = await User.findAll({ where: { role: "waiter" } });
  return res.json({ success: true, waiters });
});
