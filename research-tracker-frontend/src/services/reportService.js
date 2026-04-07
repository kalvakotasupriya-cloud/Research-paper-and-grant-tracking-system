import api from "./api";

export const submitReport = async (data) => (await api.post("/api/reports", data)).data;
export const getAllReports = async () => (await api.get("/api/reports")).data;
export const getReportsByGrant = async (grantId) => (await api.get(`/api/reports/grant/${grantId}`)).data;
export const generateReport = async (grantId) => (await api.get(`/api/reports/generate/${grantId}`)).data;
