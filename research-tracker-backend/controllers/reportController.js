import { createReport, getAllReports, getReportsByGrant } from "../models/reportModel.js";

export const submitReport = async (req, res, next) => {
  try {
    const { grant_id: grantId, report_text: reportText, status } = req.body;
    const reportId = await createReport({
      grantId,
      researcherId: req.user.id,
      reportText,
      status
    });
    return res.status(201).json({ success: true, message: "Progress report submitted", data: { id: reportId } });
  } catch (error) {
    return next(error);
  }
};

export const listReports = async (req, res, next) => {
  try {
    const reports = await getAllReports();
    return res.json({ success: true, data: reports });
  } catch (error) {
    return next(error);
  }
};

export const listReportsByGrant = async (req, res, next) => {
  try {
    const reports = await getReportsByGrant(req.params.id);
    return res.json({ success: true, data: reports });
  } catch (error) {
    return next(error);
  }
};

export const generateGrantSummary = async (req, res, next) => {
  try {
    const reports = await getReportsByGrant(req.params.grant_id);
    if (!reports.length) {
      return res.status(404).json({ success: false, message: "No reports found for this grant" });
    }

    const summary = {
      grant_id: Number(req.params.grant_id),
      total_reports: reports.length,
      latest_submission: reports[0].submitted_at,
      statuses: reports.reduce((acc, report) => {
        acc[report.status] = (acc[report.status] || 0) + 1;
        return acc;
      }, {}),
      combined_highlights: reports
        .slice(0, 5)
        .map((r) => r.report_text)
        .join(" | ")
    };

    return res.json({ success: true, message: "Summary generated", data: summary });
  } catch (error) {
    return next(error);
  }
};
