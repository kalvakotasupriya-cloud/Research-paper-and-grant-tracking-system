import express from "express";
import { body, validationResult } from "express-validator";
import { login, logout, profile, register } from "../controllers/authController.js";
import authMiddleware from "../middleware/authMiddleware.js";
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
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").isLength({ min: 6 }).withMessage("Password must be at least 6 characters"),
    body("role")
      .optional()
      .isIn(["researcher", "admin", "reviewer", "funding_authority"])
      .withMessage("Invalid role")
  ],
  validate,
  register
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required")
  ],
  validate,
  login
);

router.post("/logout", authMiddleware, sessionMiddleware, logout);
router.get("/profile", authMiddleware, sessionMiddleware, profile);

export default router;
