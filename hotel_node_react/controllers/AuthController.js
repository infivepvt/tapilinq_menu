import { Op } from "sequelize";
import AppError from "../errors/CustomError.js";
import Session from "../models/Session.js";
import User from "../models/User.js";
import asyncHandler from "../utils/asyncHandler.js";
import { comparePassword, hashPassword } from "../utils/bcryptUtil.js";
import { generateToken } from "../utils/jwtUtil.js";
import { v4 as uuidv4 } from "uuid";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;
  const exitstingUser = await User.findOne({ where: { email } });
  if (exitstingUser) {
    throw new AppError("User already exists with this email", 400);
  }
  await User.create({ name, email, password: hashPassword(password) });
  return res.json({ success: true, message: "User registered successfully" });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email } });
  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }
  const isPasswordMatched = comparePassword(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = generateToken(user.id);
  const sessionId = uuidv4();

  await Session.create({
    sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 2), // 2 hours
  });

  return res.json({
    success: true,
    message: "User logged in successfully",
    token,
    sessionId,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const adminLogin = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ where: { email, role: "admin" } });
  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }
  const isPasswordMatched = comparePassword(password, user.password);
  if (!isPasswordMatched) {
    throw new AppError("Invalid credentials", 400);
  }

  const token = generateToken(user.id);
  const sessionId = uuidv4();

  await Session.create({
    sessionId,
    userId: user.id,
    expiresAt: new Date(Date.now() + 60 * 60 * 1000 * 2), // 2 hours
  });

  return res.json({
    success: true,
    message: "User logged in successfully",
    token,
    sessionId,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const refresh = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const session = await Session.findOne({ where: { sessionId } });
  if (!session) {
    throw new AppError("Session not found", 400);
  }
  if (session.expiresAt < new Date()) {
    throw new AppError("Session expired", 400);
  }
  // Delete the expired sessions
  await Session.destroy({
    where: {
      expiresAt: {
        [Op.lt]: new Date(),
      },
    },
  });
  const user = await User.findByPk(session.userId);
  const token = generateToken(session.userId, sessionId);
  return res.json({
    success: true,
    message: "Token refreshed successfully",
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const logout = asyncHandler(async (req, res) => {
  const { sessionId } = req.body;
  const session = await Session.findOne({ where: { sessionId } });
  if (!session) {
    throw new AppError("Session not found", 400);
  }
  await session.destroy();
  return res.json({
    success: true,
    message: "User logged out successfully",
  });
});
