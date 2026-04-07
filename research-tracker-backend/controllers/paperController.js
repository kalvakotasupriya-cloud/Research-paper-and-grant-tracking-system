import {
  createPaper,
  deletePaperById,
  getAllPapers,
  getPaperById,
  getPapersByAuthor,
  updatePaperStatus
} from "../models/paperModel.js";

export const submitPaper = async (req, res, next) => {
  try {
    const { title, abstract, journal_name: journalName, file_path: filePath } = req.body;
    const paperId = await createPaper({
      title,
      abstract,
      authorId: req.user.id,
      journalName,
      filePath
    });
    return res.status(201).json({ success: true, message: "Paper submitted", data: { id: paperId } });
  } catch (error) {
    return next(error);
  }
};

export const listPapers = async (req, res, next) => {
  try {
    const papers = await getAllPapers();
    return res.json({ success: true, data: papers });
  } catch (error) {
    return next(error);
  }
};

export const listMyPapers = async (req, res, next) => {
  try {
    const papers = await getPapersByAuthor(req.user.id);
    return res.json({ success: true, data: papers });
  } catch (error) {
    return next(error);
  }
};

export const getPaperDetails = async (req, res, next) => {
  try {
    const paper = await getPaperById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: "Paper not found" });
    }
    return res.json({ success: true, data: paper });
  } catch (error) {
    return next(error);
  }
};

export const changePaperStatus = async (req, res, next) => {
  try {
    const affectedRows = await updatePaperStatus(req.params.id, req.body.status);
    if (!affectedRows) {
      return res.status(404).json({ success: false, message: "Paper not found" });
    }
    return res.json({ success: true, message: "Paper status updated" });
  } catch (error) {
    return next(error);
  }
};

export const removePaper = async (req, res, next) => {
  try {
    const paper = await getPaperById(req.params.id);
    if (!paper) {
      return res.status(404).json({ success: false, message: "Paper not found" });
    }

    if (req.user.role === "researcher" && paper.author_id !== req.user.id) {
      return res.status(403).json({ success: false, message: "You can only delete your own papers" });
    }

    await deletePaperById(req.params.id);
    return res.json({ success: true, message: "Paper deleted" });
  } catch (error) {
    return next(error);
  }
};
