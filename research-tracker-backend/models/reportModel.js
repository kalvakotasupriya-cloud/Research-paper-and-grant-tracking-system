import pool from "../config/db.js";

export const createReport = async ({ grantId, researcherId, reportText, status }) => {
  const [result] = await pool.query(
    `INSERT INTO progress_reports (grant_id, researcher_id, report_text, status)
     VALUES (?, ?, ?, ?)`,
    [grantId, researcherId, reportText, status || "submitted"]
  );
  return result.insertId;
};

export const getAllReports = async () => {
  const [rows] = await pool.query(
    `SELECT pr.*, u.name AS researcher_name, g.title AS grant_title
     FROM progress_reports pr
     JOIN users u ON pr.researcher_id = u.id
     JOIN grants g ON pr.grant_id = g.id
     ORDER BY pr.submitted_at DESC`
  );
  return rows;
};

export const getReportsByGrant = async (grantId) => {
  const [rows] = await pool.query(
    `SELECT pr.*, u.name AS researcher_name
     FROM progress_reports pr
     JOIN users u ON pr.researcher_id = u.id
     WHERE pr.grant_id = ?
     ORDER BY pr.submitted_at DESC`,
    [grantId]
  );
  return rows;
};
