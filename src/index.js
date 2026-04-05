import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import prisma from "./config/db.js";
import globalErrorHandler from "./middlewares/errorHandler.js";
import AppError from "./utils/AppError.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ─── Security middleware ───────────────────────────────────────────────────────

app.use(helmet());

app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS?.split(",") || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Limit repeated requests to auth endpoints (100 req / 15 min per IP)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    status: "fail",
    message: "Too many requests from this IP, please try again after 15 minutes.",
  },
});

// ─── Body parsing ─────────────────────────────────────────────────────────────

// Limit payload size to prevent large-body attacks
app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));

// ─── Routes ───────────────────────────────────────────────────────────────────

app.get("/", (_req, res) => {
  res.json({ status: "success", message: "Cricket Backend API is running." });
});

app.use("/api/auth", authLimiter, authRoutes);

// ─── 404 handler ─────────────────────────────────────────────────────────────

app.all("*", (req, _res, next) => {
  next(new AppError(`Cannot find ${req.method} ${req.originalUrl} on this server.`, 404));
});

// ─── Global error handler ─────────────────────────────────────────────────────

app.use(globalErrorHandler);

// ─── Server start ─────────────────────────────────────────────────────────────

const server = app.listen(PORT, () => {
  console.log(`[server] Running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`);
});

// ─── Graceful shutdown ────────────────────────────────────────────────────────

const shutdown = async (signal) => {
  console.log(`[server] ${signal} received — shutting down gracefully…`);
  server.close(async () => {
    await prisma.$disconnect();
    console.log("[server] Process terminated.");
    process.exit(0);
  });
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

// Catch unhandled promise rejections (e.g. DB connection failure at startup)
process.on("unhandledRejection", (err) => {
  console.error("[server] Unhandled Rejection:", err.name, err.message);
  shutdown("unhandledRejection");
});

// Catch uncaught synchronous exceptions
process.on("uncaughtException", (err) => {
  console.error("[server] Uncaught Exception:", err.name, err.message);
  process.exit(1);
});
