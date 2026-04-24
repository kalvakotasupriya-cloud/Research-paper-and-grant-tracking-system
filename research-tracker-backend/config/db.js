import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const connectionConfig =
  isProduction && process.env.DATABASE_URL
    ? {
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      }
    : {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "research_tracker",
        ssl: isProduction ? { rejectUnauthorized: false } : undefined
      };

const pool = mysql.createPool({
  ...connectionConfig,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0
});

if (typeof pool.on === "function") {
  pool.on("connection", () => {
    console.log("New MySQL connection established");
  });
}

export const testDbConnection = async () => {
  const connection = await pool.getConnection();
  connection.release();
};

export default pool;
