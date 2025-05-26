import Category from "../models/Category.js";
import ExtraItem from "../models/ExtraItem.js";
import Image from "../models/Image.js";
import Option from "../models/Options.js";
import Order from "../models/Order.js";
import OrderItem from "../models/OrderItem.js";
import Product from "../models/Products.js";
import Session from "../models/Session.js";
import Table from "../models/Table.js";
import User from "../models/User.js";
import Varient from "../models/Varient.js";
import logger from "../utils/loggerUtil.js";
import { sequelize } from "./db.js";

export const syncDatabase = async () => {
  try {
    await sequelize.sync(); // Use { force: true } to drop and recreate tables
    // await sequelize.sync({ force: true }); // Uncomment to drop and recreate tables
    logger.info("Database synchronized successfully.");
  } catch (error) {
    logger.error("Error synchronizing the database:", error);
  }
};
