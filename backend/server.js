import "dotenv/config";

import express from "express";
import cors from "cors";

import { connectDB } from "./config/db.js";

import authRoutes from "./routes/auth.js";
import habitRoutes from "./routes/habits.js";
import logRoutes from "./routes/logs.js";
import aiRoutes from "./routes/ai.js";

import {
  notFound,
  errorHandler,
} from "./middleware/errorHandler.js";

const app = express();

// =========================
// CORS
// =========================

const corsOptions = {
  origin: true,
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// =========================
// Middleware
// =========================

app.use(express.json({ limit: "1mb" }));

// =========================
// Health Check
// =========================

app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    time: new Date().toISOString(),
  });
});

// =========================
// Routes
// =========================

app.use("/api/auth", authRoutes);

app.use("/api/habits", habitRoutes);

app.use("/api/logs", logRoutes);

app.use("/api/ai", aiRoutes);

// =========================
// Error Handling
// =========================

app.use(notFound);

app.use(errorHandler);

// =========================
// Server
// =========================

const PORT = process.env.PORT || 8000;

connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
    process.exit(1);
  });