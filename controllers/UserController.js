import AppError from "../errors/CustomError.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { hashPassword } from "../utils/bcryptUtil.js";

export const newUser = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body;
  const existUser = await User.findOne({ where: { email } });
  if (existUser) throw new AppError("This email allready exists", 400);
  let hash = hashPassword(password);
  await User.create({ ...req.body, password: hash });
  return res.json({ success: true, message: "User added" });
});

export const updateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const formData = req.body;
  const user = await User.findByPk(id);
  if (!user) throw new AppError("User not found", 404);
  await user.update(formData);
  return res.json({ success: true, message: "User updated" });
});

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.findAll();
  return res.json({ success: true, users });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  await User.destroy({ where: { id } });
  return res.json({ success: true, message: "User removed" });
});
