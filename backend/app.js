import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet"; // For security headers
import morgan from "morgan"; // For logging requests

// Import Routes
import adminRoute from "./routes/admin.route.js";
import categoryRoute from "./routes/category.route.js";
import productRoute from "./routes/product.route.js";

const app = express();

// --------------------
// Middleware
// --------------------

// Trust proxy is required for secure cookies on Render
app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Logging HTTP requests in development
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Enable CORS for frontend domains
app.use(
  cors({
    origin: [
      "https://admin-dhg0.onrender.com", // Your production frontend
      "http://localhost:5173",           // Local development frontend
    ],
    credentials: true, // Allow cookies to be sent
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 200,
  })
);

// Parse JSON and URL-encoded data
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// Parse cookies
app.use(cookieParser());

// --------------------
// Routes
// --------------------
app.use("/api/ver1/admin", adminRoute);
app.use("/api/ver1/category", categoryRoute);
app.use("/api/ver1/product", productRoute);

// --------------------
// Global Error Handler
// --------------------
app.use((err, req, res, next) => {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

// --------------------
// 404 Handler
// --------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

export { app };
