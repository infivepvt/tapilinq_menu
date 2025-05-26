import express from "express";
import multer from "multer";
import adminAuth from "../middlewares/adminAuthMiddleware.js";
import {
  addProduct,
  deleteProduct,
  getActiveProducts,
  getProducts,
  loadTaxDetails,
  saveTax,
  updateProduct,
} from "../controllers/ProductController.js";
const router = express.Router();
const upload = multer();

// ADMIN
router.post("/", upload.any(), adminAuth, addProduct);
router.post("/:productId", upload.any(), adminAuth, updateProduct);
router.post("/delete/:id", adminAuth, deleteProduct);
router.get("/", adminAuth, getProducts);

// CUSTOMER
router.get("/customer/products", getActiveProducts);
router.get("/tax/tax", loadTaxDetails);
router.post("/tax/save-tax", saveTax);

export default router;
