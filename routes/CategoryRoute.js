import express from "express";
import multer from "multer";
import adminAuth from "../middlewares/adminAuthMiddleware.js";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  updateCategory,
} from "../controllers/CategoryController.js";

const router = express.Router();
const upload = multer();

router.post("/", adminAuth, upload.any(), addCategory);
router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/:id", adminAuth, upload.any(), updateCategory);
router.post("/delete/:id", adminAuth, deleteCategory);

export default router;
