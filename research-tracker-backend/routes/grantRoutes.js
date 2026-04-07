import express from "express";
import { body, param, validationResult } from "express-validator";
import {
  applyGrant,
  changeGrantStatus,
  getGrantDetails,
  listGrants,
  listMyGrants,
  recordUtilization
} from "../controllers/grantController.js";
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
  [
    body("title").notEmpty(),
    body("description").notEmpty(),
    body("amount_requested").isFloat({ gt: 0 }),
    body("deadline").isISO8601()
  ],
  validate,
  applyGrant
);

router.get("/", authMiddleware, sessionMiddleware, roleMiddleware("admin", "funding_authority"), listGrants);
router.get("/my", authMiddleware, sessionMiddleware, roleMiddleware("researcher"), listMyGrants);
router.get("/:id", authMiddleware, sessionMiddleware, [param("id").isInt()], validate, getGrantDetails);
router.put(
  "/:id/status",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware("admin"),
  [
    param("id").isInt(),
    body("status").isIn(["applied", "under_review", "approved", "rejected", "completed"]),
    body("amount_approved").optional().isFloat({ min: 0 })
  ],
  validate,
  changeGrantStatus
);
router.post(
  "/:id/utilize",
  authMiddleware,
  sessionMiddleware,
  roleMiddleware("researcher", "admin", "funding_authority"),
  [param("id").isInt(), body("amount_used").isFloat({ gt: 0 }), body("description").notEmpty()],
  validate,
  recordUtilization
);

export default router;
