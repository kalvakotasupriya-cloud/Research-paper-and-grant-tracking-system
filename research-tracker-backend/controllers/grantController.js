import {
  createGrant,
  createUtilization,
  getAllGrants,
  getGrantById,
  getGrantsByApplicant,
  updateGrantStatus
} from "../models/grantModel.js";

export const applyGrant = async (req, res, next) => {
  try {
    const { title, description, amount_requested: amountRequested, deadline } = req.body;
    const grantId = await createGrant({
      title,
      description,
      amountRequested,
      applicantId: req.user.id,
      deadline
    });
    return res.status(201).json({ success: true, message: "Grant application submitted", data: { id: grantId } });
  } catch (error) {
    return next(error);
  }
};

export const listGrants = async (req, res, next) => {
  try {
    const grants = await getAllGrants();
    return res.json({ success: true, data: grants });
  } catch (error) {
    return next(error);
  }
};

export const listMyGrants = async (req, res, next) => {
  try {
    const grants = await getGrantsByApplicant(req.user.id);
    return res.json({ success: true, data: grants });
  } catch (error) {
    return next(error);
  }
};

export const getGrantDetails = async (req, res, next) => {
  try {
    const grant = await getGrantById(req.params.id);
    if (!grant) {
      return res.status(404).json({ success: false, message: "Grant not found" });
    }
    return res.json({ success: true, data: grant });
  } catch (error) {
    return next(error);
  }
};

export const changeGrantStatus = async (req, res, next) => {
  try {
    const { status, amount_approved: amountApproved } = req.body;
    const affectedRows = await updateGrantStatus(req.params.id, status, amountApproved);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Grant not found" });
    }
    return res.json({ success: true, message: "Grant status updated" });
  } catch (error) {
    return next(error);
  }
};

export const recordUtilization = async (req, res, next) => {
  try {
    const grant = await getGrantById(req.params.id);
    if (!grant) {
      return res.status(404).json({ success: false, message: "Grant not found" });
    }

    if (req.user.role === "researcher" && grant.applicant_id !== req.user.id) {
      return res
        .status(403)
        .json({ success: false, message: "You can only record utilization for your own grants" });
    }

    const utilizationId = await createUtilization({
      grantId: req.params.id,
      amountUsed: req.body.amount_used,
      description: req.body.description,
      recordedBy: req.user.id
    });

    return res.status(201).json({
      success: true,
      message: "Grant utilization recorded",
      data: { id: utilizationId }
    });
  } catch (error) {
    return next(error);
  }
};
