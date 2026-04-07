import pool from "../config/db.js";

export const submitReview = async (req, res, next) => {
  try {
    const { paper_id: paperId, comments, status } = req.body;
    const [result] = await pool.query(
      "INSERT INTO reviews (paper_id, reviewer_id, comments, status) VALUES (?, ?, ?, ?)",
      [paperId, req.user.id, comments, status]
    );
    return res.status(201).json({ success: true, message: "Review submitted", data: { id: result.insertId } });
  } catch (error) {
    return next(error);
  }
};

export const getReviewsByPaper = async (req, res, next) => {
  try {
    const [rows] = await pool.query(
      `SELECT r.*, u.name AS reviewer_name
       FROM reviews r
       JOIN users u ON r.reviewer_id = u.id
       WHERE r.paper_id = ?
       ORDER BY r.reviewed_at DESC`,
      [req.params.id]
    );
    return res.json({ success: true, data: rows });
  } catch (error) {
    return next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const { comments, status } = req.body;
    const [result] = await pool.query(
      "UPDATE reviews SET comments = ?, status = ?, reviewed_at = NOW() WHERE id = ? AND reviewer_id = ?",
      [comments, status, req.params.id, req.user.id]
    );

    if (!result.affectedRows) {
      return res.status(404).json({ success: false, message: "Review not found or unauthorized" });
    }

    return res.json({ success: true, message: "Review updated" });
  } catch (error) {
    return next(error);
  }
};
