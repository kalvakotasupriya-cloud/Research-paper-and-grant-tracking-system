import pool from "../config/db.js";

const sessionMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies?.token || req.headers.authorization?.split(" ")[1];
    if (!req.session?.userId || !token) {
      return res.status(401).json({ success: false, message: "Session expired or not found" });
    }

    const [rows] = await pool.query(
      "SELECT id FROM sessions WHERE user_id = ? AND token = ? AND expires_at > NOW()",
      [req.session.userId, token]
    );

    if (!rows.length) {
      return res.status(401).json({ success: false, message: "Invalid session" });
    }

    return next();
  } catch (error) {
    return next(error);
  }
};

export default sessionMiddleware;
