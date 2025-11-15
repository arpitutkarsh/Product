import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

// VERY IMPORTANT FOR RENDER
app.set("trust proxy", 1);

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://admin-dhg0.onrender.com"
  ],
  credentials: true,   // REQUIRED for cookies
}));


app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));
app.use(cookieParser());

// Routes
import adminRoute from './routes/admin.route.js';
import categoryRoute from './routes/category.route.js';
import productRoute from './routes/product.route.js';

app.use("/api/ver1/admin", adminRoute);
app.use("/api/ver1/category", categoryRoute);
app.use("/api/ver1/product", productRoute);

export { app };
