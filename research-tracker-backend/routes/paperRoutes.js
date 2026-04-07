import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  changePaperStatus,
  getPaperDetails,
  listMyPapers,
  listPapers,
  removePaper,
  submitPaper
} from "../controllers/paperController.js";
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
  [body("title").notEmpty(), body("abstract").notEmpty()],
  validate,
  submitPaper
);
router.get("/", authMiddleware, sessionMiddleware, roleMiddleware("admin", "reviewer"), listPapers);
router.get("/my", authMiddleware, sessionMiddleware, roleMiddleware("researcher"), listMyPapers);
router.get("/:id", authMiddleware, sessionMiddleware, [param("id").isInt()], validate, getPaperDetails);
router.put(
  "/:id/status",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware("admin", "reviewer"),
  [
    param("id").isInt(),
    body("status").isIn(["draft", "submitted", "under_review", "approved", "rejected", "published"])
  ],
  validate,
  changePaperStatus
);
router.delete(
  "/:id",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware("researcher", "admin"),
  [param("id").isInt()],
  validate,
  removePaper
);

export default router;
