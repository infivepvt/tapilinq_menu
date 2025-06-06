import express from "express";
import adminAuth from "../middlewares/adminAuthMiddleware.js";
import { getDetails } from "../controllers/DashboardController.js";
const router = express.Router();

router.get("/", adminAuth, getDetails);

export default router;
