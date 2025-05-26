import express from "express";
import multer from "multer";
import {
  addTable,
  deleteTable,
  getAllTables,
  getTableById,
  getTableStatus,
  updateTable,
} from "../controllers/TableController.js";
import adminAuth from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();
const upload = multer();

router.post("/", adminAuth, upload.any(), addTable);
router.get("/", adminAuth, getAllTables);
router.get("/:id", adminAuth, getTableById);
router.post("/:id", adminAuth, upload.any(), updateTable);
router.post("/delete/:id", adminAuth, deleteTable);

// USER
router.get("/status/:tableId", getTableStatus);

export default router;
