import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const isProduction = process.env.NODE_ENV === "production";

const pool = mysql.createPool(
  isProduction && process.env.DATABASE_URL
    ? {
        uri: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false },
        waitForConnections: true,
        connectionLimit: 10
      }
    : {
        host: process.env.DB_HOST || "localhost",
        user: process.env.DB_USER || "root",
        password: process.env.DB_PASSWORD || "",
        database: process.env.DB_NAME || "research_tracker",
        waitForConnections: true,
        connectionLimit: 10,
        ssl: isProduction ? { rejectUnauthorized: false } : undefined
      }
);

export const testDbConnection = async () => {
  const connection = await pool.getConnection();
  connection.release();
};

export default pool;
