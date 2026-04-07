import api from "./api";

export const submitReview = async (data) => (await api.post("/api/reviews", data)).data;
export const getReviewsByPaper = async (paperId) => (await api.get(`/api/reviews/paper/${paperId}`)).data;
export const updateReview = async (id, data) => (await api.put(`/api/reviews/${id}`, data)).data;
