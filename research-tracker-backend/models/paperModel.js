import pool from "../config/db.js";

export const createPaper = async ({ title, abstract, authorId, journalName, filePath }) => {
  const [result] = await pool.query(
    `INSERT INTO research_papers (title, abstract, author_id, status, journal_name, file_path)
     VALUES (?, ?, ?, 'submitted', ?, ?)`,
    [title, abstract, authorId, journalName || null, filePath || null]
  );
  return result.insertId;
};

export const getAllPapers = async () => {
  const [rows] = await pool.query(
    `SELECT p.*, u.name AS author_name, u.email AS author_email
     FROM research_papers p
     JOIN users u ON p.author_id = u.id
     ORDER BY p.submission_date DESC`
  );
  return rows;
};

export const getPapersByAuthor = async (authorId) => {
  const [rows] = await pool.query(
    "SELECT * FROM research_papers WHERE author_id = ? ORDER BY submission_date DESC",
    [authorId]
  );
  return rows;
};

export const getPaperById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM research_papers WHERE id = ?", [id]);
  return rows[0] || null;
};

export const updatePaperStatus = async (id, status) => {
  const [result] = await pool.query("UPDATE research_papers SET status = ? WHERE id = ?", [status, id]);
  return result.affectedRows;
};

export const deletePaperById = async (id) => {
  const [result] = await pool.query("DELETE FROM research_papers WHERE id = ?", [id]);
  return result.affectedRows;
};
