import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import { connectDB } from "./db.js";
import { errorHandler } from "./src/middlewares/errorHandler.js";
import { apiLimiter } from "./src/middlewares/rateLimiter.js";
import authRoutes from "./src/routes/authRoutes.js";
import userRoutes from "./src/routes/userRoutes.js";

const app = express();
const port = process.env.PORT || 3000;

// Security Middleware
app.use(helmet());
app.use(
  cors({
    origin: [
      process.env.UI_BASE_URL || "http://localhost:3000",
      "http://localhost:3000",
      "http://localhost:3001",
    ],
    credentials: true,
  }),
);

// Body Parser Middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rate limiting
app.use("/api/", apiLimiter);

// Health check route
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cricket Backend is running",
    timestamp: new Date().toISOString(),
  });
});

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cricket Backend API",
    version: "1.0.0",
    endpoints: {
      auth: "/api/auth",
      users: "/api/users",
    },
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.path,
  });
});

// Global error handler
app.use(errorHandler);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      console.log(`✅ Cricket Backend Server is running on port ${port}`);
      console.log(`📝 Environment: ${process.env.NODE_ENV || "development"}`);
      console.log(
        `🔗 Base URL: ${process.env.API_BASE_URL || `http://localhost:${port}`}`,
      );
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
