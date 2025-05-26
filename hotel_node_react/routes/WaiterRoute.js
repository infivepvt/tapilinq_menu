import express from "express";
import adminAuth from "../middlewares/adminAuthMiddleware.js";
import { getWaiters } from "../controllers/WaiterController.js";
const router = express.Router();

router.get("/", adminAuth, getWaiters);

export default router;
