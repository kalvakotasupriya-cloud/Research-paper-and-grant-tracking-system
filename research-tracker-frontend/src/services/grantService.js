import api from "./api";

export const getMyGrants = async () => (await api.get("/api/grants/my")).data;
export const getAllGrants = async () => (await api.get("/api/grants")).data;
export const getGrant = async (id) => (await api.get(`/api/grants/${id}`)).data;
export const applyGrant = async (data) => (await api.post("/api/grants", data)).data;
export const updateStatus = async (id, data) => (await api.put(`/api/grants/${id}/status`, data)).data;
export const recordUtilization = async (id, data) => (await api.post(`/api/grants/${id}/utilize`, data)).data;
