import api from "./api";

export const getMyPapers = async () => (await api.get("/api/papers/my")).data;
export const getAllPapers = async () => (await api.get("/api/papers")).data;
export const getPaper = async (id) => (await api.get(`/api/papers/${id}`)).data;
export const submitPaper = async (data) =>
  (await api.post("/api/papers", data, { headers: { "Content-Type": "multipart/form-data" } })).data;
export const updateStatus = async (id, status) =>
  (await api.put(`/api/papers/${id}/status`, { status })).data;
export const deletePaper = async (id) => (await api.delete(`/api/papers/${id}`)).data;
