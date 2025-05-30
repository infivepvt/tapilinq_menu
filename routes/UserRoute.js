import express from "express";
import adminAuth from "../middlewares/adminAuthMiddleware.js";
import {
  deleteUser,
  getUsers,
  newUser,
  updateUser,
} from "../controllers/UserController.js";
const router = express.Router();

router.get("/", adminAuth, getUsers);
router.post("/", adminAuth, newUser);
router.post("/:id", adminAuth, updateUser);
router.post("/delete/:id", adminAuth, deleteUser);

export default router;
