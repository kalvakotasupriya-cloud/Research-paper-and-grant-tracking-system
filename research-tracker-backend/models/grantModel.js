import pool from "../config/db.js";

export const createGrant = async ({ title, description, amountRequested, applicantId, deadline }) => {
  const [result] = await pool.query(
    `INSERT INTO grants (title, description, amount_requested, applicant_id, status, deadline)
     VALUES (?, ?, ?, ?, 'applied', ?)`,
    [title, description, amountRequested, applicantId, deadline]
  );
  return result.insertId;
};

export const getAllGrants = async () => {
  const [rows] = await pool.query(
    `SELECT g.*, u.name AS applicant_name, u.email AS applicant_email
     FROM grants g
     JOIN users u ON g.applicant_id = u.id
     ORDER BY g.created_at DESC`
  );
  return rows;
};

export const getGrantsByApplicant = async (applicantId) => {
  const [rows] = await pool.query("SELECT * FROM grants WHERE applicant_id = ? ORDER BY created_at DESC", [
    applicantId
  ]);
  return rows;
};

export const getGrantById = async (id) => {
  const [rows] = await pool.query("SELECT * FROM grants WHERE id = ?", [id]);
  return rows[0] || null;
};

export const updateGrantStatus = async (id, status, amountApproved) => {
  const [result] = await pool.query(
    "UPDATE grants SET status = ?, amount_approved = COALESCE(?, amount_approved) WHERE id = ?",
    [status, amountApproved || null, id]
  );
  return result.affectedRows;
};

export const createUtilization = async ({ grantId, amountUsed, description, recordedBy }) => {
  const [result] = await pool.query(
    `INSERT INTO grant_utilization (grant_id, amount_used, description, recorded_by)
     VALUES (?, ?, ?, ?)`,
    [grantId, amountUsed, description, recordedBy]
  );
  return result.insertId;
};
