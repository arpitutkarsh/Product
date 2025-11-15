import dotenv from "dotenv";
dotenv.config();

import { app } from "./app.js";
import connectDB from "./database/index.js";

// Optional: Enable graceful shutdown
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception! Shutting down...");
  console.error(err);
  process.exit(1);
});

process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection! Shutting down...");
  console.error(err);
  process.exit(1);
});

const PORT = process.env.PORT || 8000;

// Connect to Database and Start Server
const startServer = async () => {
  try {
    await connectDB();
    console.log("Database connected successfully");

    app.listen(PORT, () => {
      console.log(`Server is running on PORT ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to Database:", error);
    process.exit(1); // Exit process if DB connection fails
  }
};

startServer();
