import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  generateGrantSummary,
  listReports,
  listReportsByGrant,
  submitReport
} from "../controllers/reportController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import roleMiddleware from "../middleware/roleMiddleware.js";
import sessionMiddleware from "../middleware/sessionMiddleware.js";

const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  return next();
};

router.post(
  "/",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware("researcher"),
  [body("grant_id").isInt(), body("report_text").notEmpty(), body("status").optional().isString()],
  validate,
  submitReport
);
router.get("/", authMiddleware, sessionMiddleware, roleMiddleware("admin"), listReports);
router.get("/grant/:id", authMiddleware, sessionMiddleware, [param("id").isInt()], validate, listReportsByGrant);
router.get(
  "/generate/:grant_id",
  authMiddleware,
  sessionMiddleware,
  [param("grant_id").isInt()],
  validate,
  generateGrantSummary
);

export default router;
