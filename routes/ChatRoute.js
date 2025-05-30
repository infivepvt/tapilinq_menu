import express from "express";
import {
    getAdminMessages,
    getChats,
  getCustomerMsg,
  sendMessageToCashier,
  sendMessageToUser,
} from "../controllers/ChatController.js";
const router = express.Router();

router.get("/", getCustomerMsg);
router.get("/get-chats", getChats);
router.get("/get-messages", getAdminMessages);
router.post("/send-msg", sendMessageToCashier);
router.post("/send-msg-user", sendMessageToUser);

export default router;
