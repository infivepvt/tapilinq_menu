import express from "express";
import fs from "fs";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.get("/categories/:fileName", (req, res) => {
  const { fileName } = req.params;
  try {
    res.sendFile(
      path.resolve(path.join(__dirname, "..", "uploads/categories", fileName))
    );
  } catch (error) {
    return res.status(404).json({ success: false, error: "Image not found" });
  }
});

router.get("/tables/:fileName", (req, res) => {
  const { fileName } = req.params;
  try {
    res.sendFile(
      path.resolve(path.join(__dirname, "..", "uploads/tables", fileName))
    );
  } catch (error) {
    return res.status(404).json({ success: false, error: "Image not found" });
  }
});

router.get("/products/:fileName", (req, res) => {
  const { fileName } = req.params;
  try {
    res.sendFile(
      path.resolve(path.join(__dirname, "..", "uploads/products", fileName))
    );
  } catch (error) {
    return res.status(404).json({ success: false, error: "Image not found" });
  }
});

router.get("/extra-items/:fileName", (req, res) => {
  const { fileName } = req.params;
  try {
    res.sendFile(
      path.resolve(path.join(__dirname, "..", "uploads/extra-items", fileName))
    );
  } catch (error) {
    return res.status(404).json({ success: false, error: "Image not found" });
  }
});

export default router;
