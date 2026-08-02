import http from "http";
import path from "path";
import { fileURLToPath } from "url";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import session from "express-session";
import pool, { testDbConnection } from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import paperRoutes from "./routes/paperRoutes.js";
import grantRoutes from "./routes/grantRoutes.js";
import reviewRoutes from "./routes/reviewRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set("trust proxy", 1);

const frontendUrl = process.env.FRONTEND_URL || "https://research-tracker-frontend-qdbb55e6g-supriya12.vercel.app";
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  frontendUrl,
  "https://research-tracker-frontend-qdbb55e6g-supriya12.vercel.app"
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);
app.options("*", cors());
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "research-tracker-session-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      maxAge: 24 * 60 * 60 * 1000
    }
  })
);

app.locals.dbConnected = false;

app.get("/", (req, res) => {
  res.json({ success: true, message: "Research Tracker API is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    app.locals.dbConnected = true;
    res.json({
      status: "OK",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      uptime: `${Math.floor(process.uptime())}s`,
      database: "connected",
      version: process.env.npm_package_version || "1.0.0"
    });
  } catch (err) {
    app.locals.dbConnected = false;
    res.status(503).json({
      status: "DEGRADED",
      database: "disconnected",
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
      error: err.message
    });
  }
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
    app.locals.dbConnected = true;
    console.log("Database connection established");
  } catch (error) {
    app.locals.dbConnected = false;
    console.error("Database connection failed at startup:", error.message);
  }

  if (!process.env.VERCEL) {
    server.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  }
};

if (!process.env.VERCEL) {
  startServer();
}

export default app;

