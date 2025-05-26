import { Sequelize } from "sequelize";
import dotenv from "dotenv";
import logger from "../utils/loggerUtil.js";
dotenv.config();

// Initialize Sequelize with environment variables
const dbName = process.env.DB_NAME || "default_db";
const dbUser = process.env.DB_USER;
const dbPassword = process.env.DB_PASS;
const dbHost = process.env.DB_HOST || "localhost";
const dbPort = process.env.DB_PORT || 3306;
const dbDialect = process.env.DB_DIALECT || "mysql";
const dbLogging = process.env.DB_LOGGING === "true" ? console.log : false;

export const sequelize = new Sequelize(dbName, dbUser, dbPassword, {
  host: dbHost,
  port: dbPort,
  dialect: dbDialect,
  logging: dbLogging,
  define: {
    timestamps: true, // Enable timestamps for all models
    underscored: true, // Use snake_case for column names
  },
});

export const connectToDatabase = async () => {
  try {
    await sequelize.authenticate();
    logger.info("Database connection has been established successfully.");
  } catch (error) {
    logger.error("Unable to connect to the database:", error);
  }
};
