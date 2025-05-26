import express from "express";
import AuthRoute from "./AuthRoute.js";
import TableRoute from "./TableRoute.js";
import CategoryRoute from "./CategoryRoute.js";
import ProductRoute from "./ProductRoute.js";
import OrderRoute from "./OrderRoute.js";
import WaiterRoute from "./WaiterRoute.js";

const router = express.Router();

router.use("/auth", AuthRoute);
router.use("/tables", TableRoute);
router.use("/categories", CategoryRoute);
router.use("/products", ProductRoute);
router.use("/orders", OrderRoute);
router.use("/waiters", WaiterRoute);

export default router;
