import express from "express";
import { body, param, validationResult } from "express-validator";
import { getReviewsByPaper, submitReview, updateReview } from "../controllers/reviewController.js";
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
  roleMiddleware("reviewer"),
  [
    body("paper_id").isInt(),
    body("comments").notEmpty(),
    body("status").isIn(["approved", "rejected", "needs_revision"])
  ],
  validate,
  submitReview
);
router.get("/paper/:id", authMiddleware, sessionMiddleware, [param("id").isInt()], validate, getReviewsByPaper);
router.put(
  "/:id",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware("reviewer"),
  [
    param("id").isInt(),
    body("comments").notEmpty(),
    body("status").isIn(["approved", "rejected", "needs_revision"])
  ],
  validate,
  updateReview
);

export default router;
