import express from "express";
import dotenv from "dotenv";
import logger from "./utils/loggerUtil.js";
import { connectToDatabase } from "./configs/db.js";
import { syncDatabase } from "./configs/dbSync.js";
import errorHandler from "./middlewares/errorHandler.js";
import { rateLimit } from "express-rate-limit";
import cors from "cors";
import { app, server } from "./socket.js";
import path, { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config();

const PORT = process.env.PORT || 3000;
const publicLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 500,
  message: "Too many requests from your IP. Please try again later.",
});

const origins = process.env.ORIGIN.split(",");

app.use(express.json());
app.use(publicLimiter);
app.use(
  cors({
    methods: ["GET", "POST"],
    origin: origins,
  })
);

// Import routes
import indexRoutes from "./routes/index.js";
import StaticRoute from "./routes/StaticRoute.js";

// Use routes
app.use("/api", indexRoutes);
app.use("/uploads", StaticRoute);

//

const staticPath1 = path.join(__dirname, "admin", "dist")
const staticPath2 = path.join(__dirname, "customer", "dist")
app.use(express.static(staticPath2))
app.use(express.static(staticPath1))

console.log(staticPath1);
console.log(staticPath2);


app.get("/admin", (req,res)=>{
  res.sendFile(path.join(staticPath1, "index.html"))
})

app.get("/admin/*", (req,res)=>{
  res.sendFile(path.join(staticPath1, "index.html"))
})

app.get("*", (req,res)=>{
  res.sendFile(path.join(staticPath2, "index.html"))
})

// Error handling middleware
app.use(errorHandler);

server.listen(PORT, async () => {
  logger.info(`Server is running on port ${PORT}`);
  await connectToDatabase();
  await syncDatabase();
});
