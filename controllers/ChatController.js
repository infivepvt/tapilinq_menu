import { Op } from "sequelize";
import AppError from "../errors/CustomError.js";
import Chat from "../models/Chat.js";
import ChatMessage from "../models/ChatMessage.js";
import Table from "../models/Table.js";
import asyncHandler from "../utils/asyncHandler.js";
import { generateGuestName } from "../utils/numberUtil.js";
import { io, onlineCustomers } from "../socket.js";

export const sendMessageToCashier = asyncHandler(async (req, res) => {
  const { message, username, tableId } = req.body;
  const tbl = await Table.findByPk(tableId);
  if (!tbl) throw new AppError("Table not found", 404);
  const existChat = await Chat.findOne({ where: { username, tableId } });
  const newUsername = generateGuestName();
  let uname = newUsername;
  let cId = null;
  if (username && existChat) {
    await ChatMessage.create({
      chatId: existChat.id,
      message,
    });
    uname = existChat.username;
    cId = existChat.id;
  } else {
    const chat = await Chat.create({
      username: newUsername,
      tableId: tableId,
    });
    await ChatMessage.create({
      chatId: chat.id,
      message,
    });
    cId = chat.id;
  }

  io.to("admin").emit("newMessage", { chatId: cId });
  return res.json({ success: true, message: "success", username: uname });
});

export const getCustomerMsg = asyncHandler(async (req, res) => {
  const { username, tableId } = req.query;
  const chat = await Chat.findOne({ where: { tableId, username } });
  const messages = await ChatMessage.findAll({ where: { chatId: chat.id } });
  return res.json({ success: true, messages });
});

export const getChats = asyncHandler(async (req, res) => {
  const chats = await Chat.findAll({
    where: {
      updated_at: {
        [Op.gte]: new Date(Date.now() - 24 * 60 * 60 * 1000), // last 24 hours
      },
    },
    order: [["updated_at", "desc"]],
  });
  let cs = [];
  for (let i = 0; i < chats.length; i++) {
    let table = await Table.findByPk(chats[i].tableId);
    cs.push({ ...chats[i].dataValues, table });
  }
  return res.json({ success: true, chats: cs });
});

export const getAdminMessages = asyncHandler(async (req, res) => {
  const { username, tableId } = req.query;
  const chat = await Chat.findOne({ where: { username, tableId } });
  const messages = await ChatMessage.findAll({ where: { chatId: chat.id } });
  return res.json({ success: true, messages });
});

export const sendMessageToUser = asyncHandler(async (req, res) => {
  const { username, tableId, message } = req.body;
  const chat = await Chat.findOne({ where: { username, tableId } });
  await ChatMessage.create({
    chatId: chat.id,
    message,
    sender: "cashier",
  });
  let oC = onlineCustomers.find(
    (c) => c.username === username && parseInt(c.tableId) === tableId
  );
  if (oC) {
    
    io.to(oC.socketId).emit("receivemsg", {});
  }
  return res.json({ success: true });
});
