import express from "express";
import {
  adminLogin,
  login,
  logout,
  refresh,
  register,
} from "../controllers/AuthController.js";
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/admin-login", adminLogin);
router.post("/refresh", refresh);
router.post("/logout", logout);

export default router;
