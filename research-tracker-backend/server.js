import http from "http";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import { testDbConnection } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
import grantRoutes from "./routes/grantRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000
    }
  })
);

app.get("/", (req, res) => {
  res.json({ success: true, message: "Research Tracker API is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/papers", paperRoutes);
app.use("/api/grants", grantRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/reports", reportRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  const statusCode = err.statusCode || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal server error"
  });
});

const server = http.createServer(app);

const startServer = async () => {
  try {
    await testDbConnection();
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database connection failed:", error.message);
    process.exit(1);
  }
};

startServer();
