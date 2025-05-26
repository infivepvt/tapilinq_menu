import express from "express";
import {
  acceptOrder,
  assignWaiter,
  cancleOrder,
  completeOrder,
  completePrepare,
  getCustomerOrders,
  getOrderByOrderId,
  getOrdersAdmin,
  newOrder,
  serveOrder,
} from "../controllers/OrderController.js";
import adminAuth from "../middlewares/adminAuthMiddleware.js";

const router = express.Router();

router.post("/", newOrder);
router.post("/customer", getCustomerOrders);

// ADMIN
router.get("/admin", adminAuth, getOrdersAdmin);
router.get("/admin/:orderId", adminAuth, getOrderByOrderId);
router.post("/waiter-assign", adminAuth, assignWaiter);
router.post("/accept/:id", adminAuth, acceptOrder);
router.post("/complete-prepare/:id", adminAuth, completePrepare);
router.post("/serve/:id", adminAuth, serveOrder);
router.post("/complete/:id", adminAuth, completeOrder);
router.post("/cancle/:id", adminAuth, cancleOrder);

export default router;
